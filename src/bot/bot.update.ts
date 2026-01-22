import { Ctx, On, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { ModelMessage } from "ai";

import { BotService } from "./bot.service";

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @On("text")
  onMessage(@Ctx() ctx: Context & { session: Array<ModelMessage> }) {
    return this.botService.handleMessage(ctx);
  }
}
