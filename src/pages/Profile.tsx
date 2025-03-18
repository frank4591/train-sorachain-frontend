
import { useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import Navbar from "@/components/Navbar";
import { BlurredCard } from "@/components/ui/blurred-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import AuthKeyCard from "@/components/AuthKeyCard";
import { toast } from "sonner";
import { CheckCircle, Loader2, Save, User, Calendar, Globe, Phone } from "lucide-react";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email().optional(),
  dateOfBirth: z.string().optional(),
  country: z.string().optional(),
  phoneNumber: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

export default function Profile() {
  const { user, updateUserData, isLoading } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: user?.name || "",
      email: user?.email || "",
      dateOfBirth: user?.dateOfBirth || "",
      country: user?.country || "",
      phoneNumber: user?.phoneNumber || "",
    },
  });
  
  const handleSave = (values: ProfileFormValues) => {
    setIsSaving(true);
    
    // Simulate API delay
    setTimeout(() => {
      updateUserData({
        ...values,
        email: user?.email, // Ensure email cannot be changed
      });
      
      toast.success("Profile updated successfully");
      setIsSaving(false);
    }, 1000);
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="pt-24 pb-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <motion.h1
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl font-bold"
            >
              Profile
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-muted-foreground"
            >
              Manage your account
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <BlurredCard>
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-medium">Personal Information</h2>
                  </div>
                </div>
                
                <div className="p-6 space-y-6">
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSave)} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>
                                Name <span className="text-destructive">*</span>
                              </FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Your name" 
                                  {...field} 
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="your@email.com"
                                  type="email"
                                  disabled
                                  {...field}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <FormField
                          control={form.control}
                          name="dateOfBirth"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Date of Birth</FormLabel>
                              <FormControl>
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <Input
                                    type="date"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        
                        <FormField
                          control={form.control}
                          name="phoneNumber"
                          render={({ field }) => (
                            <FormItem className="space-y-2">
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <div className="flex items-center">
                                  <Phone className="h-4 w-4 mr-2 text-muted-foreground" />
                                  <Input
                                    placeholder="+1 (555) 000-0000"
                                    {...field}
                                  />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      
                      <FormField
                        control={form.control}
                        name="country"
                        render={({ field }) => (
                          <FormItem className="space-y-2">
                            <FormLabel>Country of Residence</FormLabel>
                            <FormControl>
                              <div className="flex items-center">
                                <Globe className="h-4 w-4 mr-2 text-muted-foreground" />
                                <Input
                                  placeholder="Country"
                                  {...field}
                                />
                              </div>
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      
                      <div className="flex justify-end">
                        <Button type="submit" disabled={isSaving}>
                          {isSaving ? (
                            <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Save changes
                            </>
                          )}
                        </Button>
                      </div>
                    </form>
                  </Form>
                </div>
              </BlurredCard>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <AuthKeyCard />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <BlurredCard>
                <div className="flex items-center justify-between p-6 border-b border-border">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckCircle className="h-5 w-5 text-primary" />
                    </div>
                    <h2 className="text-xl font-medium">Account Status</h2>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground">Account ID</div>
                      <div className="text-base font-medium">{user?.id}</div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground">Status</div>
                      <div className="text-base font-medium text-green-500">Active</div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground">Joined</div>
                      <div className="text-base font-medium">Today</div>
                    </div>
                    
                    <div className="p-4 rounded-lg bg-muted/50">
                      <div className="text-sm text-muted-foreground">Tasks Completed</div>
                      <div className="text-base font-medium">0</div>
                    </div>
                  </div>
                </div>
              </BlurredCard>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
