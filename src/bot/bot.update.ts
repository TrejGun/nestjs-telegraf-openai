import { Ctx, On, Update } from "nestjs-telegraf";
import { Context } from "telegraf";
import { CoreMessage } from "ai";

import { BotService } from "./bot.service";

@Update()
export class BotUpdate {
  constructor(private readonly botService: BotService) {}

  @On("text")
  onMessage(@Ctx() ctx: Context & { session: Array<CoreMessage> }) {
    return this.botService.handleMessage(ctx);
  }
}
