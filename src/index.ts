import express from "express";
import type { Express, Request, Response } from "express";
import { getChatResponse } from "./getChatResponse";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app: Express = express();
const port = 3001;

// urlencodedとjsonは別々に初期化する
app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());

app.get("/", (req: Request, res: Response) => res.send("Hello, World!"));

app.post("/aiCompletion", async (req, res) => {
  console.log(req.body);
  const data = req.body;
  const messages: OpenAI.ChatCompletionMessage[] = [
    { role: "user", content: data?.message },
  ];
  const stream = await getChatResponse({ messages: messages });
  for await (const part of stream) {
    // here express will stream the response
    res.write(part.choices[0]?.delta.content || "");
  }
  // here express sends the closing/done/end signal for the stream consumer
  res.end("\n");
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
