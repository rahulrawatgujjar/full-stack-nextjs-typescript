"use client"

import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { signInSchema } from "@/schemas/signInSchema"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2 } from "lucide-react"
import { useState } from "react"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"


const SignInPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signInSchema>>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      identifier: "",
      password: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof signInSchema>) => {
    // console.log("data", data);
    setIsSubmitting(true);
    const result = await signIn("credentials", {
      ...data, redirect: false
    });
    setIsSubmitting(false);
    // console.log("result", result); // remove it
    if (result?.error) {
      if (result.error === "CredentialsSignin") {
        toast({
          title: "Failed",
          description: "Invalid credentials",
          variant: "destructive"
        });
      } else {
        toast({
          title: "Failed",
          description: result.error,
          variant: "destructive"
        });
      }
    }
    if (result?.url) {
      router.replace("/dashboard")
    }
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100">
      <div className="bg-white w-full max-w-md rounded-lg shadow-md p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold mb-6">Join Mystery Message</h1>
          <p className="mb-4">Sign in to start your anonymous adventure</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="identifier"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Username/Email</FormLabel>
                  <FormControl>
                    <Input placeholder="username or email" {...field} />
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
                ) : ("Sign In")
              }
            </Button>
          </form>
        </Form>
        <div className="text-center mt-4">
          <p>
            Not a member?{" "}
            <Link href="/sign-up" className="text-blue-600 hover:text-blue-800">Sign up</Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default SignInPage
