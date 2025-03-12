import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { session } from "telegraf";
import { TelegrafModule } from "nestjs-telegraf";
import { Redis } from "@telegraf/session/redis";

import { BotModule } from "./bot/bot.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `.env.${process.env.NODE_ENV!}`,
    }),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const botToken = configService.get<string>("BOT_TOKEN", "");
        const redisUrl = configService.get<string>("REDIS_URL", "");
        return {
          token: botToken,
          middlewares: [
            session({
              store: Redis({
                url: redisUrl,
              }),
              defaultSession: () => [],
            }),
          ],
          include: [BotModule],
        };
      },
    }),
    BotModule,
  ],
})
export class AppModule {}
