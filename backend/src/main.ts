import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ! for data conversion
  app.useGlobalPipes(
    new ValidationPipe({
      // disableErrorMessages: true,
      transform: true,
    }),
  );

  // ! enalbe the frontend end to access the backend
  app.enableCors({
    origin: [
      'http://18.156.158.53:3000',
      'http://localhost:3000',
      'http://localhost:5173',
      'exp://', // Expo dev client
      'frontend://', // Your custom scheme (if set)
      'http://localhost', // For dev builds
      'https://u.expo.dev/7aa578b1-b743-4956-9af6-421e70e5ad61',
    ],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // ! user api prefix
  app.setGlobalPrefix('api');

  // ! start the sever at port 4000
  console.log('port: 4000');
  await app.listen(process.env.PORT ?? 4000);
}
bootstrap().catch((err) => {
  console.error('Error during app bootstrap:', err);
  process.exit(1); // optional
});
