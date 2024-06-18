"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { messageSchema } from "@/schemas/messageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";




const MessagePage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuggesting, setIsSuggesting] = useState(false);

  const [messages, setMessages] = useState<string[]>(["What's a hobby you've recently started?", "If you could have dinner with any historical figure, who would it be?", "What's a simple thing that makes you happy?"]);

  const { toast } = useToast();

  const params = useParams();

  const router = useRouter();

  const form = useForm<z.infer<typeof messageSchema>>({
    resolver: zodResolver(messageSchema),
    defaultValues: {
      content: ""
    }
  });


  const onSubmit = async (data: z.infer<typeof messageSchema>) => {
    console.log("data:", data);
    setIsSubmitting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/send-messages", {
        username: params.username,
        content: data.content
      });
      toast({
        title: "Success",
        description: response.data.message
      });

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
      form.reset()
    }
  }

  const getSuggestedMessages = async () => {
    setIsSuggesting(true);
    try {
      const response = await axios.post<ApiResponse>("/api/suggest-messages");
      let messageString = response.data.message;
      setMessages(messageString.split("||"));
      toast({
        title: "Success",
        description: "New suggestions are successfully generated"
      });

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message,
        variant: "destructive"
      });
    } finally {
      setIsSuggesting(false);
    }
  }


  return (
    <main className='min-h-[calc(100vh-232px)] flex flex-col mx-4 md:mx-24'>
      <section className='w-full py-6'>
        <h1 className='text-3xl md:text-4xl font-bold text-center'>Public Profile Link</h1>
      </section>
      <section className='w-full py-6'>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-lg">Send anonymous message to @{params.username}</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Write your anonymous message here" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="text-center">
              <Button disabled={isSubmitting} type="submit">
                {
                  isSubmitting ? (
                    <>
                      <Loader2 className="animate-spin mr-2" />
                      Please wait
                    </>
                  ) : ("Send it")
                }
              </Button>
            </div>
          </form>
        </Form>
      </section>
      <section className="w-full py-6">
        <div className="pb-4">
          <Button onClick={getSuggestedMessages} disabled={isSuggesting}>
            {
              isSuggesting ? (
                <>
                  <Loader2 className="animate-spin mr-2" />
                  Please wait
                </>
              ) : ("Suggest Messages")
            }
          </Button>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Click any message below to select it</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid w-full items-center gap-4">
              {
                messages.map((message, index) => {
                  return (
                    <div key={index} className="flex flex-col space-y-1.5">
                      <Button onClick={(e) => {
                        form.setValue("content", message)
                      }} variant="outline"><span className="text-wrap">{message}</span></Button>
                    </div>
                  )
                })
              }
            </div>
          </CardContent>
        </Card>
      </section>
      <section className="w-full py-6">
        <h2 className="text-lg md:text:xl text-center font-semibold">Get Your Message Board</h2>
        <div className="text-center pt-3">
          <Button
            onClick={() => {
              router.push("/sign-up");
            }}>Create your account</Button>
        </div>
      </section>
    </main>
  )
}

export default MessagePage
