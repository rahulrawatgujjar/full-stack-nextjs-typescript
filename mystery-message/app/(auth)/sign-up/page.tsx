"use client"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDebounceCallback } from 'usehooks-ts';
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signUpSchema } from "@/schemas/signUpSchema";
import axios, { AxiosError } from "axios"
import { ApiResponse } from "@/types/ApiResponse";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";


const SignUpPage = () => {
  const [username, setUsername] = useState("");
  const [usernameMessage, setUsernameMessage] = useState("");
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const debounced = useDebounceCallback(setUsername, 500);
  const { toast } = useToast();
  const router = useRouter();

  // zod implementation
  const form = useForm<z.infer<typeof signUpSchema>>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      username: "",
      email: "",
      password: ""
    }
  });

  useEffect(() => {
    const checkUniqueUsername = async () => {
      setUsernameMessage("");
      if (username) {
        setIsCheckingUsername(true);
        try {
          const response = await axios.get<ApiResponse>(`/api/check-username-unique/?username=${username}`);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          setUsernameMessage(axiosError.response?.data.message ?? "Error checking username");
        } finally {
          setIsCheckingUsername(false);
        }
      }
    };
    checkUniqueUsername();
  }, [username]);

  const onSubmit = async (data: z.infer<typeof signUpSchema>) => {
    // console.log("\ndata:\n", data);
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/sign-up", data);
      // console.log("\nresponse:\n", response);
      toast({
        title: "Success",
        description: response.data.message
      });
      router.replace(`/verify/${username}`);
      setIsSubmitting(false);
    } catch (error) {
      // console.error("Error while signup", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Signup failed",
        description: axiosError.response?.data.message,
        variant: "destructive"
      });
      setIsSubmitting(false);
    }
  };


  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100">
      <div className="bg-white w-full max-w-md rounded-lg shadow-md p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold mb-6">Join Feedback-Cloak</h1>
          <p className="mb-4">Sign up to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="username"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} onChange={(e) => {
                      field.onChange(e);
                      // setUsername(e.target.value);
                      debounced(e.target.value);
                    }} />
                  </FormControl>
                  {
                    isCheckingUsername && <Loader2 className="animate-spin" />
                  }
                  <p className={`text-sm ${usernameMessage === "Username is available" ? "text-green-500" : "text-red-500"}`}>
                    {usernameMessage}
                  </p>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Email</FormLabel>
                  <FormControl>
                    <Input placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isSubmitting}>
              {
                isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin mr-2" />
                    Please wait
                  </>
                ) : ("Signup")
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Already a member?{" "}
            <Link href="/sign-in" className="text-blue-600 hover:text-blue-800">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignUpPage
