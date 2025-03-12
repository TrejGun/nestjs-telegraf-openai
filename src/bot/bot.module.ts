import { Module } from "@nestjs/common";

import { BotUpdate } from "./bot.update";
import { BotService } from "./bot.service";
import { ChatModule } from "../chat/chat.module";

@Module({
  imports: [ChatModule],
  providers: [BotUpdate, BotService],
  exports: [BotService],
})
export class BotModule {}
