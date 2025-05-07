import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    const configService = app.get(ConfigService);
    const logger = new Logger('Bootstrap');

    // Get environment variables with development defaults
    const port = parseInt(configService.get<string>('PORT', '5001'), 10);
    const corsOrigin = configService.get<string>('CORS_ORIGIN', 'http://localhost:3001');

    // Development CORS configuration
    app.enableCors({
      origin: true,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    });
    logger.log(`CORS enabled for development origins`);

    // Development validation pipe
    app.useGlobalPipes(new ValidationPipe({
      transform: true,
    }));

    await app.listen(port);
    logger.log(`Development server running on: ${await app.getUrl()}`);
    logger.log(`Memory usage: ${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`);
  } catch (error) {
    const logger = new Logger('Bootstrap');

    if (error.code === 'EADDRINUSE') {
      logger.error(`Port ${error.port} is already in use. Please try a different port in your .env file.`);
    } else if (error.code === 'EACCES') {
      logger.error(`Permission denied to use port ${error.port}. Try using a port above 1024.`);
    } else {
      logger.error(`Failed to start application: ${error.message}`);
      logger.error(`Stack trace: ${error.stack}`);
    }

    process.exit(1);
  }
}

bootstrap();
