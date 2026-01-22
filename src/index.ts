import { NestFactory } from "@nestjs/core";
import { NestExpressApplication } from "@nestjs/platform-express";
import { ConfigService } from "@nestjs/config";

import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const configService = app.get(ConfigService);

  const host = configService.get<string>("HOST", "localhost");
  const port = configService.get<string>("PORT", "3001");

  await app.listen(Number(port), host, () => {
    console.info(`API server is running on http://${host}:${port}`);
  });
}

void bootstrap();
