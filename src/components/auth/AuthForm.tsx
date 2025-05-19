
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/components/ui/use-toast";
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
import { Mail, Lock, User } from "lucide-react";
import { Separator } from "@/components/ui/separator";

// Form schemas
const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type LoginSchema = z.infer<typeof loginSchema>;
type RegisterSchema = z.infer<typeof registerSchema>;

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Login form
  const loginForm = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // Register form
  const registerForm = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Handle login submission
  const onLoginSubmit = (data: LoginSchema) => {
    console.log("Login data:", data);
    
    // Mock successful login
    toast({
      title: "Login Successful",
      description: "Welcome back to StudySpark!",
    });
    navigate("/");
  };

  // Handle registration submission
  const onRegisterSubmit = (data: RegisterSchema) => {
    console.log("Register data:", data);
    
    // Mock successful registration
    toast({
      title: "Registration Successful",
      description: "Welcome to StudySpark! You can now log in.",
    });
    setIsLogin(true);
  };

  return (
    <div className="mx-auto w-full max-w-md space-y-6 rounded-lg border bg-white p-6 shadow-md dark:bg-slate-900">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-studyspark-purple">
          {isLogin ? "Login to StudySpark" : "Create Your Account"}
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          {isLogin
            ? "Enter your credentials to access your account"
            : "Fill out the form to get started"}
        </p>
      </div>

      <Separator />

      {isLogin ? (
        <Form {...loginForm}>
          <form
            onSubmit={loginForm.handleSubmit(onLoginSubmit)}
            className="space-y-4"
          >
            <FormField
              control={loginForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="flex items-center justify-center rounded-l-md border border-r-0 bg-muted px-3">
                        <Mail size={16} className="text-muted-foreground" />
                      </div>
                      <Input
                        {...field}
                        placeholder="you@example.com"
                        type="email"
                        className="rounded-l-none"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={loginForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="flex items-center justify-center rounded-l-md border border-r-0 bg-muted px-3">
                        <Lock size={16} className="text-muted-foreground" />
                      </div>
                      <Input
                        {...field}
                        placeholder="******"
                        type="password"
                        className="rounded-l-none"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full studyspark-gradient">
              Login
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...registerForm}>
          <form
            onSubmit={registerForm.handleSubmit(onRegisterSubmit)}
            className="space-y-4"
          >
            <FormField
              control={registerForm.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="flex items-center justify-center rounded-l-md border border-r-0 bg-muted px-3">
                        <User size={16} className="text-muted-foreground" />
                      </div>
                      <Input
                        {...field}
                        placeholder="John Doe"
                        className="rounded-l-none"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={registerForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="flex items-center justify-center rounded-l-md border border-r-0 bg-muted px-3">
                        <Mail size={16} className="text-muted-foreground" />
                      </div>
                      <Input
                        {...field}
                        placeholder="you@example.com"
                        type="email"
                        className="rounded-l-none"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={registerForm.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="flex items-center justify-center rounded-l-md border border-r-0 bg-muted px-3">
                        <Lock size={16} className="text-muted-foreground" />
                      </div>
                      <Input
                        {...field}
                        placeholder="******"
                        type="password"
                        className="rounded-l-none"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={registerForm.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <div className="flex">
                      <div className="flex items-center justify-center rounded-l-md border border-r-0 bg-muted px-3">
                        <Lock size={16} className="text-muted-foreground" />
                      </div>
                      <Input
                        {...field}
                        placeholder="******"
                        type="password"
                        className="rounded-l-none"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full studyspark-gradient">
              Create Account
            </Button>
          </form>
        </Form>
      )}

      <div className="text-center text-sm">
        {isLogin ? "Don't have an account? " : "Already have an account? "}
        <Button
          variant="link"
          className="p-0 text-studyspark-purple"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "Sign up" : "Log in"}
        </Button>
      </div>
    </div>
  );
};

export default AuthForm;
