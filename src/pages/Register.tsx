
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { BlurredCard } from "@/components/ui/blurred-card";
import { Eye, EyeOff, Loader2, ArrowLeft, ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import RoleSelector from "@/components/RoleSelector";
import { UserRole } from "@/lib/constants";

const registerSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function Register() {
  const { register, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  
  const form = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  
  const onSubmit = async (data: RegisterForm) => {
    if (!selectedRole) {
      return;
    }
    
    await register(data.email, data.password, data.name, selectedRole);
  };
  
  const nextStep = () => {
    const result = form.trigger();
    if (result) {
      setStep(2);
    }
  };
  
  const prevStep = () => {
    setStep(1);
  };
  
  return (
    <div className="min-h-screen">
      <Navbar />
      
      <div className="min-h-screen py-20 px-6 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-2xl"
        >
          <BlurredCard>
            <div className="p-8">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold">Create your account</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Join SoraChain and start training AI models
                </p>
              </div>
              
              <div className="mb-8">
                <div className="flex justify-between relative">
                  <div className="flex-1 text-center z-10">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${
                        step >= 1 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      1
                    </div>
                    <div className="mt-2 text-xs font-medium">Account details</div>
                  </div>
                  
                  <div className="flex-1 text-center z-10">
                    <div
                      className={`w-8 h-8 rounded-full mx-auto flex items-center justify-center ${
                        step >= 2 ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                      }`}
                    >
                      2
                    </div>
                    <div className="mt-2 text-xs font-medium">Choose role</div>
                  </div>
                  
                  {/* Progress line */}
                  <div className="absolute top-4 left-0 right-0 h-0.5 bg-muted">
                    <div
                      className="h-full bg-primary transition-all duration-300"
                      style={{ width: step === 1 ? "0%" : "100%" }}
                    />
                  </div>
                </div>
              </div>
              
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  {step === 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="space-y-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Your name"
                                  {...field}
                                  disabled={isLoading}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="your@email.com"
                                  type="email"
                                  {...field}
                                  disabled={isLoading}
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
                              <FormLabel>Password</FormLabel>
                              <FormControl>
                                <div className="relative">
                                  <Input
                                    placeholder="••••••••"
                                    type={showPassword ? "text" : "password"}
                                    {...field}
                                    disabled={isLoading}
                                  />
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-0 top-0 h-full px-3"
                                    onClick={() => setShowPassword(!showPassword)}
                                  >
                                    {showPassword ? (
                                      <EyeOff className="h-4 w-4 text-muted-foreground" />
                                    ) : (
                                      <Eye className="h-4 w-4 text-muted-foreground" />
                                    )}
                                    <span className="sr-only">
                                      {showPassword ? "Hide password" : "Show password"}
                                    </span>
                                  </Button>
                                </div>
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="pt-6">
                        <Button
                          type="button"
                          className="w-full"
                          onClick={nextStep}
                          disabled={isLoading}
                        >
                          Continue
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </motion.div>
                  )}
                  
                  {step === 2 && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="mb-6">
                        <h3 className="text-lg font-medium mb-4">Select your role</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          Choose how you want to participate in the SoraChain ecosystem.
                          You can change your role later in your profile settings.
                        </p>
                        
                        <RoleSelector
                          selectedRole={selectedRole}
                          onSelectRole={setSelectedRole}
                          className="mb-6"
                        />
                      </div>
                      
                      <div className="flex gap-4">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={prevStep}
                          disabled={isLoading}
                        >
                          <ArrowLeft className="mr-2 h-4 w-4" />
                          Back
                        </Button>
                        
                        <Button
                          type="submit"
                          className="flex-1"
                          disabled={isLoading || !selectedRole}
                        >
                          {isLoading ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Creating account...
                            </>
                          ) : (
                            "Create account"
                          )}
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </form>
              </Form>
              
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="text-primary font-medium hover:underline"
                  >
                    Log in
                  </Link>
                </p>
              </div>
            </div>
          </BlurredCard>
        </motion.div>
      </div>
    </div>
  );
}
