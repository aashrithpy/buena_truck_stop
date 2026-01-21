import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads',
  });

  // Allow the frontend to call the API from the browser
  const allowedOrigins = new Set([
    'https://main.d3ekfvo4ndqmr8.amplifyapp.com',
    'http://localhost:3000',
    'http://localhost:4000',
  ]);

  app.enableCors({
    origin: (origin, cb) => {
      if (!origin) return cb(null, true); // allow non-browser tools
      if (allowedOrigins.has(origin)) return cb(null, true);
      return cb(null, false); // do NOT throw an error
    },
    methods: ['GET', 'HEAD', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: false, // set true ONLY if you use cookies auth
  });


  await app.listen(process.env.PORT || 4000);

}
bootstrap();
