import { Inject, Injectable, Logger, LoggerService } from "@nestjs/common";
import { openai } from "@ai-sdk/openai";
import { ModelMessage, generateText } from "ai";
import OpenAi from "openai";

import { OPENAI_CLIENT } from "./openai.provider";

@Injectable()
export class ChatService {
  constructor(
    @Inject(OPENAI_CLIENT)
    private readonly openaiClient: OpenAi,
    @Inject(Logger)
    protected readonly loggerService: LoggerService,
  ) {}

  public async chat(messages: Array<ModelMessage>) {
    const result = await generateText({
      model: openai("gpt-4o-mini"),
      messages,
    });

    return result.text;
  }

  public async moderate(messages: Array<ModelMessage>) {
    const current = messages[messages.length - 1];

    const { results } = await this.openaiClient.moderations.create({
      input:
        typeof current.content === "string"
          ? current.content
          : current.content.reduce<Array<string>>((memo, current) => {
              if (current.type === "text") {
                return memo.concat(current.text);
              }
              return memo;
            }, []),
    });

    return results.some(result => result.flagged);
  }
}
