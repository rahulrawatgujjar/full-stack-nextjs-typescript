"use client"
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { verifySchema } from '@/schemas/verifySchema';
import { ApiResponse } from '@/types/ApiResponse';
import { zodResolver } from '@hookform/resolvers/zod';
import axios, { AxiosError } from 'axios';
import { verify } from 'crypto';
import { Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from "zod";


const VerifyAccountPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
    defaultValues: {
      code: ""
    }
  });

  const onSubmit = async (data: z.infer<typeof verifySchema>) => {
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/verify-code", {
        username: params.username,
        code: data.code
      });

      toast({
        title: "Success",
        description: response.data.message
      });

      router.replace("/sign-in");
    } catch (error) {
      console.log("Error while verifying user", error); // remove it

      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Failed to verify user",
        description: axiosError.response?.data.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  }


  return (
    <div className="flex justify-center items-center min-h-screen bg-slate-100">
      <div className="bg-white w-full max-w-md rounded-lg shadow-md p-8 space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-extrabold mb-6">Verify Your Account</h1>
          <p className="mb-4">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              name="code"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-bold">Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="code" {...field} />
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
                ) : ("Submit")
              }
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default VerifyAccountPage
