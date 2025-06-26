import { useState } from "react";
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  Github,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { authClient } from "~/lib/auth.client";
import { redirect, useNavigate } from "@remix-run/react";
import { LoaderFunctionArgs } from "@remix-run/node";
import { auth } from "~/lib/auth.server";

export async function loader({ request }: LoaderFunctionArgs) {
  const session = await auth.api.getSession(request);
  if (session) return redirect("/app/home");
  return null;
}

export default function SignInPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });

  const navigate = useNavigate();

  const handleInputChange = (e: {
    target: { name: any; value: any; type: any; checked: any };
  }) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    if (!formData.email.trim()) {
      return "Please enter your email address.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      return "Please enter a valid email address.";
    }

    if (!formData.password.trim()) {
      return "Please enter your password.";
    }

    return null;
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    setError("");

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);

    // Authorise user
    try {
      await authClient.signIn.email(
        {
          email: formData.email,
          password: formData.password,
        },
        {
          onRequest: (ctx: any) => {
            setIsLoading(true);
          },
          onSuccess: (ctx: any) => {
            setIsLoading(false);
            navigate("/app/play/home");
          },
          onError: (ctx: any) => {
            setIsLoading(false);

            if (ctx.error.status === 403)
              setError("Please verify your email address");
            else
              setError(ctx.error.message || "An error occurred during sign up");
          },
        }
      );
    } catch (err) {
      setError("Sign in failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialLogin = (provider: string) => {
    console.log(`Logging in with ${provider}`);
    // Handle social login here
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
        {/* Background gradient effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="w-full max-w-md relative z-10 bg-gray-900/50 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-8 h-8 text-green-400" />
            </div>
          </div>

          <h2 className="text-2xl font-bold text-white mb-4">Welcome Back!</h2>

          <p className="text-gray-400 mb-6">
            You have successfully signed in to your account. Redirecting to your
            dashboard...
          </p>

          <button
            onClick={() => setSuccess(false)}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            Sign In Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 px-4">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/5 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-md relative z-10 bg-gray-900/50 backdrop-blur-lg border border-white/10 rounded-xl shadow-2xl">
        <div className="p-6 pb-0">
          <div className="text-center mb-6">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Welcome Back
            </h1>
            <p className="text-gray-400 mt-2">
              Sign in to continue to your account
            </p>
          </div>

          <div className="space-y-6">
            {/* Social Login Buttons */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => handleSocialLogin("github")}
                className="flex items-center justify-center w-full py-2.5 px-4 bg-gray-800/50 border border-white/20 hover:bg-gray-700/50 text-gray-200 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </button>

              <button
                onClick={() => handleSocialLogin("google")}
                className="flex items-center justify-center w-full py-2.5 px-4 bg-gray-800/50 border border-white/20 hover:bg-gray-700/50 text-gray-200 rounded-lg transition-colors"
                disabled={isSubmitting}
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-gray-950 px-2 text-gray-400">
                  Or sign in with
                </span>
              </div>
            </div>

            {/* Error Alert */}
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Sign In Form */}
            <div className="space-y-4">
              <div className="pb-4">
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="absolute left-3 h-4 w-4 text-gray-400" />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-800/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="pb-4">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Password
                </label>
                <div className="relative flex items-center">
                  <Lock className="absolute left-3 h-4 w-4 text-gray-400" />
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Enter your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-800/50 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    required
                    disabled={isSubmitting}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 text-gray-400 hover:text-gray-200 transition-colors"
                    disabled={isSubmitting}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pb-4">
                <div className="flex items-center space-x-2">
                  <input
                    id="rememberMe"
                    name="rememberMe"
                    type="checkbox"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-purple-600 bg-gray-800 border-white/20 rounded focus:ring-purple-500 focus:ring-2"
                    disabled={isSubmitting}
                  />
                  <label htmlFor="rememberMe" className="text-sm text-gray-400">
                    Remember me
                  </label>
                </div>
                <a
                  href="/forgot-password"
                  className="text-sm text-purple-400 hover:text-purple-300 transition-colors underline"
                >
                  Forgot password?
                </a>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white font-medium py-3 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  "Sign In"
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="p-6 pt-4 text-center text-sm text-gray-400 border-t border-white/10">
          Don't have an account?{" "}
          <a
            href="/auth/signup"
            className="text-purple-400 hover:text-purple-300 transition-colors font-medium underline"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
