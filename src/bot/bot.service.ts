import { BadRequestException, Injectable } from "@nestjs/common";
import { Context } from "telegraf";
import type { Message } from "@telegraf/types";
import { ModelMessage } from "ai";

import { ChatService } from "../chat/chat.service";

@Injectable()
export class BotService {
  constructor(private readonly chatService: ChatService) {}

  public async handleMessage(ctx: Context & { session: Array<ModelMessage> }) {
    const message = ctx.message as Message.TextMessage;

    if (!message.text) {
      await ctx.reply("No text provided");
      return;
    }

    ctx.session.push({
      content: message.text,
      role: "user",
    });

    const isFlagged = await this.chatService.moderate(ctx.session);
    if (isFlagged) {
      throw new BadRequestException("Please refrain on using any offensive language.");
    }

    const text = await this.chatService.chat(ctx.session);

    ctx.session.push({
      content: text,
      role: "assistant",
    });

    await ctx.reply(text);
  }
}
