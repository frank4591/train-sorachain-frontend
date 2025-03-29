
import { useState, useEffect } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { BlurredCard } from "@/components/ui/blurred-card";
import { Alert, AlertDescription } from "@/components/ui/alert";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  password: z.string().min(1, {
    message: "Password is required.",
  }),
});

type FormValues = z.infer<typeof formSchema>;

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Extract the redirect path from location state, default to dashboard
  const from = location.state?.from || "/dashboard";
  console.log("Login page, redirect path:", from);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setError(null);
    
    try {
      console.log("Attempting login with:", values.email);
      await login(values.email, values.password);
      // After successful login, AuthProvider will handle navigation
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please try again later.");
      setIsSubmitting(false);
      setFailedAttempts(prev => prev + 1);
    }
  };

  useEffect(() => {
    // Store current path for after login, if it's in location state
    if (location.state?.from) {
      console.log("Will redirect to:", location.state.from);
      sessionStorage.setItem('redirectPath', location.state.from);
    }
  }, [location]);

  if (isAuthenticated) {
    // Redirect to the page they were trying to access, or dashboard as fallback
    console.log("User is authenticated, redirecting to:", from);
    return <Navigate to={from} replace />;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        <BlurredCard className="w-full">
          <div className="p-6">
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-[#29647c]">Welcome back</h1>
              <p className="text-[#29647c]/70 mt-1">
                Sign in to your account to continue
              </p>
            </div>

            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#29647c]">Email</FormLabel>
                      <FormControl>
                        <Input 
                          type="email" 
                          placeholder="you@example.com" 
                          {...field} 
                          className="border-[#29647c]/30 focus-visible:ring-[#29647c]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[#29647c]">Password</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          placeholder="Enter your password"
                          {...field}
                          className="border-[#29647c]/30 focus-visible:ring-[#29647c]"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#29647c] hover:bg-[#29647c]/80 text-white"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Signing in...
                    </>
                  ) : (
                    "Sign in"
                  )}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm">
              <span className="text-[#29647c]/70">
                Don&apos;t have an account?{" "}
              </span>
              <Link 
                to="/register" 
                state={{ from: location.state?.from }}
                className="font-medium text-[#29647c] hover:underline"
              >
                Sign up
              </Link>
              
              {failedAttempts >= 2 && (
                <div className="mt-3">
                  <Link to="/reset-password" className="font-medium text-[#29647c] hover:underline">
                    Forgot password? Reset it here
                  </Link>
                </div>
              )}
            </div>
          </div>
        </BlurredCard>
      </motion.div>
    </div>
  );
}
