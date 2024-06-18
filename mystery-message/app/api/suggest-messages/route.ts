import { ApiResponse } from '@/types/ApiResponse';
// import {  openai } from '@ai-sdk/openai';
// import { streamText } from 'ai';
import { NextResponse } from 'next/server';
import genAI from '@/lib/genAI';


// Allow streaming responses up to 30 seconds
// export const maxDuration = 30;

export async function POST(req: Request) {

  try {
    const prompt = "Create a list of three open-ended and engaging questions formatted as a single string. Each question should be separated by '||'. These questions are for an anonymous social messaging platform, like Qooh.me, and should be suitable for a diverse audience. Avoid personal or sensitive topics, focusing instead on universal themes that encourage friendly interaction. For example, your output should be structured like this: 'What's a hobby you've recently started?|| If you could have dinner with any historical figure, who would it be?|| What's a simple thing that makes you happy?'. Fosure the questions are intriguing, foster curiosity, an contribute to a positive and welcoming conversational environment.";
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    // const result = await streamText({
    //   model: openai('gpt-4-turbo'),
    //   prompt,
    // });
    // return result.toAIStreamResponse();

    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();
    console.log(text);
    if (text) {
      const response: ApiResponse = {
        success: true,
        message: text
      };
      return NextResponse.json(response, { status: 200 });
    } else {
      throw new Error("Got an empty response.")
    }


  } catch (error) {
    console.log("An unexpected error occured", error);
    const response: ApiResponse = {
      success: false,
      message: "Error occured while generating suggestions"
    };
    return NextResponse.json(response, { status: 500 });
  }
}