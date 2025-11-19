import { useState, useEffect, useRef, useCallback } from "react";
import { Send, Mic, RotateCw } from "lucide-react"; 

// --- 1. TTS Audio Utility Functions ---

/**
 * Converts a Base64 string into an ArrayBuffer.
 * @param {string} base64 - Base64 encoded string.
 * @returns {ArrayBuffer}
 */
const base64ToArrayBuffer = (base64) => {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

// --- Helper for Exponential Backoff ---
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

// --- API KEY FIX ---
// Using the explicit key from the .env file to resolve 403 Forbidden errors
const EXPLICIT_GEMINI_API_KEY = "AIzaSyBRFrL8RSo-eJxmleV98QJNRdHC387hhJ4"; 


export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false); 
  const recognitionRef = useRef(null);
  const chatEndRef = useRef(null); 
  const audioContextRef = useRef(null); // Ref for AudioContext

  const suggestions = [
    "Suggest decor for small living room",
    "Give modern bedroom interior ideas",
    "Best wall color for warm aesthetic",
    "Recommend trendy home décor products",
    "How to decorate minimalistic workspace",
  ];

  // --- Initialize AudioContext on first interaction ---
  useEffect(() => {
    // Initialize AudioContext only when necessary (like on first render or interaction)
    if (!audioContextRef.current) {
        // Use a function to ensure it's created lazily if needed
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
  }, []);

  // --- 2. Text-to-Speech (TTS) function using Web Audio API for playback ---
  const speak = async (text) => {
    // FIX: Use the explicit key
    const apiKey = EXPLICIT_GEMINI_API_KEY; 
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;
    
    // Ensure AudioContext is ready before making the API call
    if (!audioContextRef.current) {
        console.error("AudioContext is not initialized.");
        return;
    }
    const audioContext = audioContextRef.current;

    const payload = {
      contents: [{
        parts: [{ text: text }]
      }],
      generationConfig: {
        responseModalities: ["AUDIO"],
        speechConfig: {
          voiceConfig: {
            // Using a high-quality professional voice
            prebuiltVoiceConfig: { voiceName: "Kore" } 
          }
        }
      },
      model: "gemini-2.5-flash-preview-tts"
    };

    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

      const result = await response.json();
      const part = result?.candidates?.[0]?.content?.parts?.[0];
      const audioData = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType;

      if (audioData && mimeType && mimeType.startsWith("audio/L16")) {
        const match = mimeType.match(/rate=(\d+)/);
        const sampleRate = match ? parseInt(match[1], 10) : 24000;

        // 1. Convert Base64 data to ArrayBuffer
        const pcmDataBuffer = base64ToArrayBuffer(audioData);
        // 2. The API returns signed 16-bit PCM (Int16Array)
        const pcm16 = new Int16Array(pcmDataBuffer);
        
        // 3. Create an empty AudioBuffer in the AudioContext
        const audioBuffer = audioContext.createBuffer(1, pcm16.length, sampleRate);
        const now = audioBuffer.getChannelData(0); // Get the floating-point array for the channel
        
        // 4. Normalize the 16-bit PCM data to the AudioBuffer's -1.0 to 1.0 range
        for (let i = 0; i < pcm16.length; i++) {
            // Divide by 32768 (2^15) to normalize the signed 16-bit value
            now[i] = pcm16[i] / 32768.0; 
        }

        // 5. Create a buffer source and play the audio
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.connect(audioContext.destination);
        
        // If the context is suspended (common on mobile), resume it
        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }
        
        source.start(0); // Play immediately
      } else {
        console.warn("TTS response missing expected audio data or format.");
      }
    } catch (error) {
      console.error("TTS API call failed:", error);
    }
  };


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // --- 3. Refactored sendMessage using Fetch and Exponential Backoff ---
  const sendMessage = useCallback(
    async (msg) => {
      if (!msg.trim()) return;

      const userMessage = { sender: "user", text: msg };
      setMessages((prev) => [...prev, userMessage]);
      setInput("");
      setIsTyping(true); // Start typing indicator

      // FIX: Use the explicit key
      const apiKey = EXPLICIT_GEMINI_API_KEY; 
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;

      const payload = {
        contents: [{ parts: [{ text: msg }] }],
        // Adding Google Search grounding for up-to-date responses
        tools: [{ "google_search": {} }], 
      };

      let result = null;
      let success = false;
      let retries = 0;
      const maxRetries = 5;

      // Exponential Backoff Retry Loop
      while (!success && retries < maxRetries) {
        try {
          const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          });

          // Handle rate limiting (429) or other temporary server errors
          if (response.status === 429 && retries < maxRetries - 1) {
            const backoffTime = Math.pow(2, retries) * 1000 + (Math.random() * 1000); 
            await delay(backoffTime);
            retries++;
            continue; 
          }
          
          // Check for 403 Forbidden errors which usually indicate an invalid key
          if (response.status === 403) {
            console.error("Critical API Error: 403 Forbidden. Check API Key validity.");
            throw new Error(`API call failed with status: ${response.status} (Forbidden)`);
          }

          if (!response.ok) {
            throw new Error(`API call failed with status: ${response.status}`);
          }

          result = await response.json();
          success = true; 
          
        } catch (err) {
          if (retries === maxRetries - 1) {
            console.error("Gemini API call failed after max retries:", err);
          }
          retries++;
        }
      }

      // Process the result
      try {
        if (result) {
          const aiText = result.candidates?.[0]?.content?.parts?.[0]?.text || "I'm sorry, I couldn't generate a response right now.";

          const botMessage = { sender: "bot", text: aiText };
          setMessages((prev) => [...prev, botMessage]);
          
          await speak(aiText); 
        } else {
          // If result is null after all retries, throw a specific error
          throw new Error("No successful result from Gemini API.");
        }

      } catch (err) {
        console.error("Gemini error:", err);
        const errorText = "The AI service is temporarily unavailable. Please try again.";
        setMessages((prev) => [
          ...prev,
          { sender: "bot", text: errorText },
        ]);
        await speak(errorText); // Speak the error message
      } finally {
        setIsTyping(false); // Stop typing indicator
      }
    },
    [speak] // speak is a dependency now
  );
  
  // Setup Speech-to-Text (STT) recognition (Kept user's native browser implementation)
  useEffect(() => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      console.warn("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en-US";

    recognition.onstart = () => {
      setIsListening(true);
    };
    recognition.onend = () => {
      setIsListening(false);
    };
    recognition.onerror = (event) => {
      console.error("Speech recognition error:", event.error);
      setIsListening(false);
    };
    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      sendMessage(transcript); 
    };

    recognitionRef.current = recognition;
  }, [sendMessage]); 

  // Toggle listening function
  const handleListen = () => {
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Resume AudioContext if suspended (necessary for some browsers to play audio)
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume().catch(e => console.error("Failed to resume AudioContext:", e));
      }
      recognitionRef.current.start();
    }
  };


  return (
    <div className="w-full min-h-screen bg-gray-50 flex flex-col items-center p-4 sm:p-6 font-sans">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 border-b-2 border-indigo-500 pb-1">
        Professional AI Assistant
      </h1>

      {/* Suggestions */}
      <div className="flex gap-2 sm:gap-3 flex-wrap justify-center mb-6 max-w-2xl">
        {suggestions.map((item, i) => (
          <button
            key={i}
            onClick={() => sendMessage(item)}
            className="px-3 py-1.5 sm:px-4 sm:py-2 bg-white text-indigo-600 border border-indigo-200 rounded-full shadow-sm hover:bg-indigo-50 hover:border-indigo-300 transition-all text-xs sm:text-sm whitespace-nowrap"
          >
            {item}
          </button>
        ))}
      </div>

      {/* Chat Messages Container */}
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-xl p-4 sm:p-6 h-[75vh] overflow-y-auto border border-gray-200">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`flex w-full ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`my-2 p-3 sm:p-4 rounded-xl max-w-[90%] sm:max-w-[70%] text-sm sm:text-base transition-all duration-300 shadow-md ${
                msg.sender === "user"
                  ? "bg-indigo-600 text-white rounded-br-none" // User bubble style
                  : "bg-gray-100 text-gray-800 rounded-tl-none" // Bot bubble style
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        
        {/* Professional Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start w-full">
            <div className="my-2 p-3 sm:p-4 rounded-xl max-w-[70%] bg-gray-100 text-gray-600 rounded-tl-none flex items-center shadow-md">
              <RotateCw className="size-4 animate-spin mr-2" />
              <span>Assistant is thinking...</span>
            </div>
          </div>
        )}

        <div ref={chatEndRef} /> {/* Element to scroll to */}
      </div>

      {/* Input and Buttons */}
      <div className="w-full max-w-3xl mt-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask a question..."
          className="flex-1 p-3 sm:p-4 rounded-xl border-2 border-gray-300 bg-white shadow-md transition-all duration-200 ease-in-out focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 hover:border-indigo-400 text-gray-800"
          onKeyPress={(e) => e.key === "Enter" && sendMessage(input)}
          disabled={isTyping}
        />
        
        {/* Animated Mic Button */}
        <button
          onClick={handleListen}
          className={`relative px-4 py-3 sm:px-5 sm:py-4 rounded-xl shadow-lg transition-all duration-300 ease-in-out text-white ${
            isListening
              ? "bg-red-500 hover:bg-red-600" // Active listening style
              : "bg-indigo-600 hover:bg-indigo-700" // Normal style
          }`}
          disabled={isTyping}
        >
          {isListening && (
            <span className="absolute inset-0 inline-flex h-full w-full rounded-xl bg-red-400 opacity-75 animate-ping duration-700 delay-100"></span>
          )}
          <Mic className="size-5 relative z-10" />
        </button>

        {/* Send Button */}
        <button
          onClick={() => sendMessage(input)}
          className="px-6 py-3 sm:px-8 sm:py-4 bg-indigo-600 text-white rounded-xl shadow-lg hover:bg-indigo-700 transition-colors duration-200 flex items-center"
          disabled={isTyping || !input.trim()}
        >
          <Send className="size-5" />
          <span className="hidden sm:inline ml-2">Send</span>
        </button>
      </div>
    </div>
  );
}