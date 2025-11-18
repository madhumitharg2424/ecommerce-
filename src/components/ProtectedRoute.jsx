import { Navigate } from "react-router-dom";
import { useSession } from "@supabase/auth-helpers-react";

export default function ProtectedRoute({ children }) {
  const session = useSession();

  // If no session, redirect to /auth
  if (!session) {
    return <Navigate to="/auth" replace />;
  }

  // Otherwise, render the protected page
  return children;
}
