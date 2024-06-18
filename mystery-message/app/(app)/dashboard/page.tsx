"use client"

import MessageCard from "@/components/MessageCard";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";
import { Message } from "@/models/User";
import { acceptMessageSchema } from "@/schemas/acceptMessageSchema";
import { ApiResponse } from "@/types/ApiResponse";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { Loader2, RefreshCcw } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";



const DashboardPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSwitchLoading, setIsSwitchLoading] = useState(false);

  const { toast } = useToast();

  const handleDeleteMessage = (messageId: string) => {
    setMessages(messages.filter((message) => message._id !== messageId));
  };

  const { data: session } = useSession();

  const form = useForm<z.infer<typeof acceptMessageSchema>>({
    resolver: zodResolver(acceptMessageSchema)
  });

  const { register, watch, setValue } = form;

  const acceptMessages = watch("acceptMessages");

  const fetchAcceptMessage = useCallback(async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/accept-messages");
      setValue("acceptMessages", response.data.isAcceptingMessage ?? false);

    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? "Error while fetching accept message status",
        variant: "destructive"
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }, [setValue, toast]);

  const fetchMessages = useCallback(async (refresh: boolean = false) => {
    setIsLoading(true);
    setIsSwitchLoading(true);
    try {
      const response = await axios.get<ApiResponse>("/api/get-messages");
      // console.log("messages:", response.data.messages);
      setMessages(response.data.messages ?? []);
      if (refresh) {
        toast({
          title: "Refreshed Messages",
          description: "Showing latest messages"
        });
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? "Error while fetching messages",
        variant: "destructive"
      });
    } finally {
      setIsSwitchLoading(false);
      setIsLoading(false);
    }
  }, [setIsLoading, setMessages, toast]);

  useEffect(() => {
    if (!session || !session.user) return;
    fetchAcceptMessage();
    fetchMessages();
  }, [session, setValue, fetchAcceptMessage, fetchMessages]);

  const handleSwitchChange = async () => {
    setIsSwitchLoading(true);
    try {
      const response = await axios.post<ApiResponse>("/api/accept-messages", {
        acceptMessages: !acceptMessages
      });
      setValue("acceptMessages", !acceptMessages);
      toast({
        title: "Success",
        description: response.data.message
      });
    } catch (error) {
      // console.log("Error while updating message acceptence status", error);
      const axiosError = error as AxiosError<ApiResponse>;
      toast({
        title: "Error",
        description: axiosError.response?.data.message ?? "Error while updating message acceptence status",
        variant: "destructive"
      });
    } finally {
      setIsSwitchLoading(false);
    }
  }

  // const baseUrl = `${window.location.protocol}//${window.location.host}`;
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  const profileUrl = `${baseUrl}/u/${session?.user.username}`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(profileUrl);
    toast({
      title: "Url copied",
      description: "Profile url has been copied to clipboard"
    });
  }



  if (!session || !session.user) {
    return (
      <>
        <div>Please login</div>
      </>
    );
  }

  return (
    <>
      <div className="mt-4 my-8 sm:w-[90%] lg:container mx-auto p-6 bg-white rounded min-h-[calc(100vh-296px)]">
        <h1 className="text-4xl font-bold mb-4 text-center">User Dashboard</h1>

        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">Copy Your Unique Link</h2>{' '}
          <div className="flex items-center">
            <input
              type="text"
              value={profileUrl}
              disabled
              className="input input-bordered w-full p-2 mr-2"
            />
            <Button onClick={copyToClipboard}>Copy</Button>
          </div>
        </div>
        <Separator className="my-6" />
        <div className="mb-4">
          <Switch
            {...register('acceptMessages')}
            checked={acceptMessages}
            onCheckedChange={handleSwitchChange}
            disabled={isSwitchLoading}
          />
          <span className="ml-2">
            Accept Messages: {acceptMessages ? 'On' : 'Off'}
          </span>
        </div>
        <Separator className="my-6" />

        <Button
          className="mt-4"
          variant="outline"
          onClick={(e) => {
            e.preventDefault();
            fetchMessages(true);
          }}
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCcw className="h-4 w-4" />
          )}
        </Button>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <MessageCard
                key={(message._id as object).toString()}
                message={message}
                onMessageDelete={handleDeleteMessage}
              />
            ))
          ) : (
            <p>No messages to display.</p>
          )}
        </div>
      </div>
    </>
  );
};

export default DashboardPage