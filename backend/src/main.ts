import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ! for data conversion
  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true,
      transform: true
    }),
  );
  
  // ! enalbe the frontend end to access the backend
  app.enableCors({
    origin: [
      'http://192.168.90.126:3000',
      'http://localhost:3000',
      'http://localhost:5173',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });
  
  // ! user api prefix
  app.setGlobalPrefix('api');

  // ! start the sever at port 4000
  console.log("port: 4000");
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap();
