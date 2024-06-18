import { Message } from "@/models/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: object;
  isAcceptingMessage?: boolean;
  messages?: Array<Message>;
}