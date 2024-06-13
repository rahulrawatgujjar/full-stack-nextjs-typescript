import { resend } from "@/lib/resend";
import VerificationEmail from "@/emails/VerificationEmail";
import { ApiResponse } from "@/types/ApiResponse";


export async function sendVerificationEmail(
  username: string,
  email: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    const emailResponse = await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: email,
      subject: "Mystery message | Verification code",
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    console.log("\nemailResponse:\n", emailResponse); // remove it

    if (emailResponse.error) {
      return {
        success: false,
        message: emailResponse.error.message
      }
    }
    return {
      success: true,
      message: "Verification email send successfully"
    }
  } catch (emailError) {
    console.error("Error while sending verification email", emailError);
    return {
      success: false,
      message: "Failed to send verification email"
    }
  }
}