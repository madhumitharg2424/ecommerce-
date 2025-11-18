import { useState, useEffect, useRef, useCallback } from "react";

import { GoogleGenerativeAI } from "@google/generative-ai";

import { Send, Mic, RotateCw } from "lucide-react"; // Importing icons for a professional look



// 1. Initialize the SDK with the API key from environment variables

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);



// 2. Use the stable model name

const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });



// Variables for voice selection

let femaleVoice = null;

const voiceLoadPromise = new Promise(resolve => {

  const loadVoices = () => {

    const voices = window.speechSynthesis.getVoices();

    femaleVoice = voices.find(voice => voice.gender === 'female' || voice.name.toLowerCase().includes('female') || voice.name.toLowerCase().includes('zira'));

    resolve();

  };

 

  // Wait for voices to be loaded

  if (window.speechSynthesis.getVoices().length) {

    loadVoices();

  } else {

    window.speechSynthesis.onvoiceschanged = loadVoices;

  }

});





export default function Chat() {

  const [messages, setMessages] = useState([]);

  const [input, setInput] = useState("");

  const [isListening, setIsListening] = useState(false);

  const [isTyping, setIsTyping] = useState(false); // NEW: Typing Indicator State

  const recognitionRef = useRef(null);

  const chatEndRef = useRef(null); // Ref for auto-scrolling



  const suggestions = [

    "Suggest decor for small living room",

    "Give modern bedroom interior ideas",

    "Best wall color for warm aesthetic",

    "Recommend trendy home décor products",

    "How to decorate minimalistic workspace",

  ];



  // Text-to-Speech (TTS) function - UPDATED for Female Voice

  const speak = (text) => {

    voiceLoadPromise.then(() => {

        const utterance = new SpeechSynthesisUtterance(text);

        if (femaleVoice) {

            utterance.voice = femaleVoice;

        }

        window.speechSynthesis.speak(utterance);

    });

  };



  // Scroll to the bottom of the chat container

  useEffect(() => {

    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });

  }, [messages]);



  // Setup Speech-to-Text (STT) and Gemini API call

  const sendMessage = useCallback(

    async (msg) => {

      if (!msg.trim()) return;



      const userMessage = { sender: "user", text: msg };

      setMessages((prev) => [...prev, userMessage]);

      setInput("");

      setIsTyping(true); // Start typing indicator



      try {

        const result = await model.generateContent(msg);

        const aiText = result.response.text();



        const botMessage = { sender: "bot", text: aiText };

        setMessages((prev) => [...prev, botMessage]);

        speak(aiText);



      } catch (err) {

        console.error("Gemini error:", err);

        const errorText = "The AI service is temporarily unavailable. Please try again.";

        setMessages((prev) => [

          ...prev,

          { sender: "bot", text: errorText },

        ]);

        speak(errorText);

      } finally {

        setIsTyping(false); // Stop typing indicator

      }

    },

    []

  );

 

  // Setup Speech-to-Text (STT) recognition

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

      window.speechSynthesis.cancel();

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

       

        {/* NEW: Professional Typing Indicator */}

        {isTyping && (

          <div className="flex justify-start w-full">

            <div className="my-2 p-3 sm:p-4 rounded-xl max-w-[70%] bg-gray-100 text-gray-600 rounded-tl-none flex items-center shadow-md">

              <RotateCw className="size-4 animate-spin mr-2" />

              <span>Assistant is typing...</span>

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

        />

       

        {/* Animated Mic Button */}

        <button

          onClick={handleListen}

          className={`relative px-4 py-3 sm:px-5 sm:py-4 rounded-xl shadow-lg transition-all duration-300 ease-in-out text-white ${

            isListening

              ? "bg-red-500 hover:bg-red-600" // Active listening style

              : "bg-indigo-600 hover:bg-indigo-700" // Normal style

          }`}

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

        >

          <Send className="size-5" />

          <span className="hidden sm:inline ml-2">Send</span>

        </button>

      </div>

    </div>

  );

}