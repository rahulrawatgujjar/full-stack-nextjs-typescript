import { Message } from "@/models/User";

export interface ApiResponse {
  success: boolean;
  message: string;
  data?: object;
  isAcceptingMessages?: boolean;
  messages?: Array<Message>;
}