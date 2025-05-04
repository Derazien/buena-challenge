import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const logger = new Logger('Bootstrap');

    // Get environment variables with fallbacks
    const port = parseInt(configService.get<string>('PORT', '5001'), 10);
    const nodeEnv = configService.get<string>('NODE_ENV', 'development');
    const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:3000');

    // CORS configuration based on environment
    if (nodeEnv === 'development') {
      app.enableCors({
        origin: [
          'http://localhost:3000',
          'http://localhost:3001',
          'http://localhost:5001',
          corsOrigin
        ].filter(Boolean),
        credentials: true,
      });
      logger.log(`CORS enabled for development origins`);
    } else {
      app.enableCors({
        origin: corsOrigin,
        credentials: true,
      });
      logger.log(`CORS enabled for: ${corsOrigin}`);
    }

    await app.listen(port);
    logger.log(`Application is running on: ${await app.getUrl()} in ${nodeEnv} mode`);
  } catch (error) {
    const logger = new Logger('Bootstrap');

    if (error.code === 'EADDRINUSE') {
      logger.error(`Port ${error.port} is already in use. Please try a different port in your .env file.`);
    } else {
      logger.error(`Failed to start application: ${error.message}`);
    }

    process.exit(1);
  }
}

bootstrap();
