import { ConfigService } from "@nestjs/config";
import OpenAi from "openai";

export const OPENAI_CLIENT = Symbol("OPENAI_CLIENT");

export const openaiClientProvider = {
  provide: OPENAI_CLIENT,
  inject: [ConfigService],
  useFactory: (configService: ConfigService): OpenAi => {
    const apiKey = configService.get<string>("OPENAI_API_KEY", "");
    return new OpenAi({ apiKey });
  },
};
