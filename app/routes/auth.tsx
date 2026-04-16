import { usePuterStore } from "../lib/puter";
import { useEffect } from "react";
import { useNavigate } from "react-router";

const Auth = () => {
  const { isLoading, auth, hasCheckedAuth } = usePuterStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (hasCheckedAuth && auth.isAuthenticated) {
      navigate("/");
    }
  }, [hasCheckedAuth, auth.isAuthenticated]);

  if (!hasCheckedAuth) return null;

  return (
    <main className="bg-[url('/images/bg-auth.svg')] bg-cover min-h-screen flex items-center justify-center">
      <div className="gradient-border shadow-lg">
        <section className="flex flex-col gap-8 bg-white rounded-2xl p-10">

          <h1>Welcome</h1>

          {isLoading ? (
            <button className="auth-button animate-pulse">
              Signing you in...
            </button>
          ) : auth.isAuthenticated ? (
            <button className="auth-button" onClick={() => auth.signOut()}>
              Log Out
            </button>
          ) : (
            <button
              className="auth-button"
              onClick={() => auth.signIn()}
            >
              Log In
            </button>
          )}

        </section>
      </div>
    </main>
  );
};

export default Auth;