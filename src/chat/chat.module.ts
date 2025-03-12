import { Module, Logger } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { ChatService } from "./chat.service";
import { openaiClientProvider } from "./openai.provider";

@Module({
  imports: [ConfigModule],
  providers: [openaiClientProvider, Logger, ChatService],
  exports: [ChatService],
})
export class ChatModule {}
