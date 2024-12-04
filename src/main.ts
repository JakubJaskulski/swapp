import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { SwappErrorFilter } from "./filters/swapp.filter";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalFilters(new SwappErrorFilter());
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
