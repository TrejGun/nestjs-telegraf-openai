import { BadRequestException, Injectable } from "@nestjs/common";
import { Context } from "telegraf";
import type { Message as MessageType } from "@telegraf/types";
import { CoreMessage } from "ai";

import { ChatService } from "../chat/chat.service";

@Injectable()
export class BotService {
  constructor(private readonly chatService: ChatService) {}

  public async handleMessage(ctx: Context & { session: Array<CoreMessage> }) {
    const message = ctx.message as MessageType.TextMessage;

    if (!message.text) {
      await ctx.reply("No text provided");
      return;
    }

    const msg: CoreMessage = {
      content: message.text,
      role: "user",
    };

    ctx.session.push(msg);

    const isFlaged = await this.chatService.moderate(ctx.session);
    if (isFlaged) {
      throw new BadRequestException("Please refrain on using any offensive language.");
    }

    const stream = this.chatService.chat(ctx.session);

    let resultText = "";
    for await (const part of stream.textStream) {
      resultText += part;
    }

    ctx.session.push({
      content: resultText,
      role: "assistant",
    });

    await ctx.reply(resultText);
  }
}
