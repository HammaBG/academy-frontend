"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "../store/auth";

export default function Home() {
  const { 
    user, 
    token, 
    isAuthenticated, 
    isLoading, 
    error, 
    login, 
    signup, 
    logout, 
    getProfile, 
    clearError 
  } = useAuthStore();

  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // Clear errors when switching views
  useEffect(() => {
    clearError();
    setSuccessMsg("");
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setPhone("");
  }, [isLoginView, clearError]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccessMsg("");
    clearError();

    if (isLoginView) {
      await login(email, password);
    } else {
      await signup(email, password, firstName, lastName, phone);
      // If signup is successful (no error thrown), show a message
      const currentError = useAuthStore.getState().error;
      if (!currentError) {
        setSuccessMsg("Signup successful! Please log in.");
        setIsLoginView(true);
      }
    }
  };

  const handleFetchProfile = async () => {
    await getProfile();
  };

  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 bg-gradient-to-br from-zinc-900 to-black font-sans text-zinc-100 p-4">
        <div className="w-full max-w-md bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-all duration-500 ease-in-out">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -mr-10 -mt-10"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -ml-10 -mb-10"></div>
          
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-2 tracking-tight">Dashboard</h2>
            <p className="text-zinc-400 mb-8 border-b border-zinc-800 pb-4">
              Welcome back! You are securely logged in.
            </p>

            <div className="space-y-4 mb-8">
              <div className="bg-black/40 border border-zinc-800/50 rounded-2xl p-4">
                <p className="text-sm text-zinc-500 mb-1">JWT Token (truncated)</p>
                <p className="font-mono text-xs text-green-400 break-all bg-black/50 p-2 rounded-lg border border-zinc-800">
                  {token ? `${token.substring(0, 40)}...` : "No token"}
                </p>
              </div>

              <div className="bg-black/40 border border-zinc-800/50 rounded-2xl p-4">
                <div className="flex justify-between items-center mb-4">
                  <p className="text-sm text-zinc-500">Profile Data</p>
                  <button 
                    onClick={handleFetchProfile}
                    className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1 rounded-full transition-colors font-medium flex items-center gap-2"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full mr-1"></span>
                    ) : null}
                    Refresh Profile
                  </button>
                </div>
                {user ? (
                  <pre className="font-mono text-xs text-zinc-300 overflow-auto bg-black/50 p-3 rounded-xl border border-zinc-800">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                ) : (
                  <p className="text-sm text-zinc-500 italic">No profile data fetched yet.</p>
                )}
              </div>
            </div>

            <button
              onClick={logout}
              className="w-full py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-all duration-200 active:scale-[0.98] border border-zinc-700"
            >
              Log Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 bg-gradient-to-br from-zinc-900 to-black font-sans text-zinc-100 p-4">
      <div className="w-full max-w-md bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden transition-all duration-500 ease-in-out">
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -ml-10 -mt-10"></div>
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-purple-500/20 rounded-full blur-3xl -mr-10 -mb-10"></div>
        
        <div className="relative z-10 flex flex-col items-center">
          <div className="w-16 h-16 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20 mb-6 rounded-tl-[10px] rounded-br-[10px]">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            </svg>
          </div>
          
          <h2 className="text-3xl font-bold mb-2 tracking-tight text-center">
            {isLoginView ? 'Welcome back' : 'Create an account'}
          </h2>
          <p className="text-zinc-400 mb-8 text-center text-sm">
            {isLoginView ? 'Enter your credentials to access your account' : 'Sign up to get started with our platform'}
          </p>

          {(error || successMsg) && (
            <div className={`w-full p-3 mb-6 rounded-xl border text-sm text-center ${error ? 'bg-red-500/10 border-red-500/50 text-red-400' : 'bg-green-500/10 border-green-500/50 text-green-400'}`}>
              {error || successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="w-full space-y-4">
            {!isLoginView && (
              <>
                <div className="flex gap-4">
                  <div className="space-y-1 w-full">
                    <label className="text-xs font-medium text-zinc-400 ml-1">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="Jane"
                    />
                  </div>
                  <div className="space-y-1 w-full">
                    <label className="text-xs font-medium text-zinc-400 ml-1">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                      placeholder="Doe"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-medium text-zinc-400 ml-1">Phone Number <span className="text-zinc-500">(Optional)</span></label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                    placeholder="+1 234 567 890"
                  />
                </div>
              </>
            )}

            <div className="space-y-1">
              <label className="text-xs font-medium text-zinc-400 ml-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="you@example.com"
              />
            </div>
            
            <div className="space-y-1 pb-2">
              <label className="text-xs font-medium text-zinc-400 ml-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black/40 border border-zinc-800 rounded-xl px-4 py-3 text-white placeholder-zinc-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-white hover:bg-zinc-200 text-black rounded-xl font-bold transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {isLoading ? (
                <span className="animate-spin h-5 w-5 border-2 border-black/80 border-t-transparent rounded-full"></span>
              ) : (
                isLoginView ? 'Log In' : 'Sign Up'
              )}
            </button>
          </form>

          <div className="mt-8">
            <button
              onClick={() => setIsLoginView(!isLoginView)}
              className="text-sm text-zinc-400 hover:text-white transition-colors"
            >
              {isLoginView ? "Don't have an account? Sign up" : "Already have an account? Log in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
