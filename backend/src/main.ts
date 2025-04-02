import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import validationOptions from './utils/validation.options';
import * as CookieParser from "cookie-parser" ;

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe(validationOptions))
  app.use(CookieParser());
  app.enableCors({
    //origin: "http://localhost:3001",
    origin: "https://helpdesk.anyinit.com",
    credentials: true
  });
  await app.listen(process.env.PORT||3000);
}
bootstrap();
