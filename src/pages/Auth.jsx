import { useSession, useSupabaseClient } from "@supabase/auth-helpers-react";

export default function Auth() {
  const session = useSession();
  const supabase = useSupabaseClient();

  const handleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: "http://localhost:5173/",
      },
    });
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
      {!session ? (
        <>
          <h1 className="text-2xl font-bold mb-4">Sign in</h1>
          <button
            onClick={handleLogin}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Sign in with Google
          </button>
        </>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-4">Welcome {session.user.email}</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Sign out
          </button>
        </>
      )}
    </div>
  );
}
