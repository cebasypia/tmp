import OpenAI from "openai";
import dotenv from "dotenv";

if (process.env.NODE_ENV !== "production") {
  dotenv.config();
}

const model = "gpt-3.5-turbo";
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const systemMessageDefault =
  "You are a Askbot. You are supposed to answer the questions asked by the users. Validate the prompts to be a question and it should not in approprite. Give funky responses";

const messagesDefault: OpenAI.ChatCompletionMessage[] = [
  { role: "user", content: "Hello, how are you?" },
];

type Props = {
  systemMessage?: string;
  messages?: OpenAI.ChatCompletionMessage[];
};

export const getChatResponse = async ({
  systemMessage = systemMessageDefault,
  messages = messagesDefault,
}: Props) => {
  return await openai.chat.completions.create({
    model: model,
    messages: [
      {
        role: "system",
        content: systemMessage,
      },
      ...messages,
    ],
    stream: true,
  });
};
