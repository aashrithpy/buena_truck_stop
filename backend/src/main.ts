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
  const corsOrigin = process.env.CORS_ORIGIN || 'http://localhost:3000';

  app.enableCors({
  origin: (origin, cb) => {
    if (!origin) return cb(null, true);
    if (origin.startsWith("http://localhost:")) return cb(null, true);
    return cb(new Error(`CORS blocked: ${origin}`), false);
  },
  methods: ["GET", "HEAD", "POST", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
});


  await app.listen(process.env.PORT || 4000);

}
bootstrap();
