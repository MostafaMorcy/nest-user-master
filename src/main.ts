import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { config } from 'dotenv';
import { AllExceptionsFilter } from './all-exceptions.filter';
import { ApiKeyGuard } from './gurd/api-key.guard'; // Adjust the import path as necessary
import { ValidationPipe } from '@nestjs/common';

config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Apply global guard and exception filter
  // app.useGlobalGuards(new ApiKeyGuard());
  app.useGlobalFilters(new AllExceptionsFilter());
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true, // Strip properties that do not have decorators
    forbidNonWhitelisted: true, // Throw an error if non-whitelisted properties are provided
    transform: true, // Automatically transform payloads to DTO instances
  }));
  // Swagger configuration
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Users')
    .setDescription('The Users API description')
    .setVersion('0.1')
    .addApiKey(
      { type: 'apiKey', name: 'api-key', in: 'header' },
      'api-key',
    )
    .build();

  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
