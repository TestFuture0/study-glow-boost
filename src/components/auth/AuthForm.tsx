import { useState, useEffect } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/context/AuthContext";
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
import { Loader2 } from "lucide-react";

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
  const { signIn, signUp, isLoading } = useAuth();

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

  // Get the register function from registerForm
  const { control: registerFormControl, register: registerField, handleSubmit: handleRegisterSubmit, formState: { errors: registerErrors } } = registerForm;

  // Handle login submission
  const onLoginSubmit = async (data: LoginSchema) => {
    await signIn(data.email, data.password);
  };

  // Handle registration submission
  const onRegisterSubmit = async (data: RegisterSchema) => {
    await signUp(data.email, data.password, data.name);
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

            <Button 
              type="submit" 
              className="w-full studyspark-gradient"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </Form>
      ) : (
        <Form {...registerForm}>
          <form
            onSubmit={handleRegisterSubmit(onRegisterSubmit)}
            className="space-y-4"
          >
            {/* Full Name - Uncontrolled with register */}
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <div className="flex">
                  <div className="flex items-center justify-center rounded-l-md border border-r-0 bg-muted px-3">
                    <User size={16} className="text-muted-foreground" />
                  </div>
                  <input 
                    {...registerField("name")}
                    type="text"
                    placeholder="John Doe (Uncontrolled)"
                    autoComplete="off"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm rounded-l-none"
                  />
                </div>
              </FormControl>
              {registerErrors.name && <FormMessage>{registerErrors.name.message}</FormMessage>}
            </FormItem>

            {/* Email - Uncontrolled with register */}
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <div className="flex">
                  <div className="flex items-center justify-center rounded-l-md border border-r-0 bg-muted px-3">
                    <Mail size={16} className="text-muted-foreground" />
                  </div>
                  <Input
                    {...registerField("email")}
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className="rounded-l-none"
                  />
                </div>
              </FormControl>
              {registerErrors.email && <FormMessage>{registerErrors.email.message}</FormMessage>}
            </FormItem>

            {/* Password - Uncontrolled with register */}
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <div className="flex">
                  <div className="flex items-center justify-center rounded-l-md border border-r-0 bg-muted px-3">
                    <Lock size={16} className="text-muted-foreground" />
                  </div>
                  <Input
                    {...registerField("password")}
                    type="password"
                    placeholder="******"
                    autoComplete="new-password"
                    className="rounded-l-none"
                  />
                </div>
              </FormControl>
              {registerErrors.password && <FormMessage>{registerErrors.password.message}</FormMessage>}
            </FormItem>

            {/* Confirm Password - Uncontrolled with register */}
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <div className="flex">
                  <div className="flex items-center justify-center rounded-l-md border border-r-0 bg-muted px-3">
                    <Lock size={16} className="text-muted-foreground" />
                  </div>
                  <Input
                    {...registerField("confirmPassword")}
                    type="password"
                    placeholder="******"
                    autoComplete="new-password"
                    className="rounded-l-none"
                  />
                </div>
              </FormControl>
              {registerErrors.confirmPassword && <FormMessage>{registerErrors.confirmPassword.message}</FormMessage>}
            </FormItem>

            <Button 
              type="submit" 
              className="w-full studyspark-gradient"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating account...
                </>
              ) : (
                "Create Account"
              )}
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
