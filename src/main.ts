import { NestFactory } from "@nestjs/core";
import { AppModule } from "@app/app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle("Minha API")
    .setDescription("Documentação da API usando Swagger")
    .setVersion("1.0")
    .addBearerAuth() // Adiciona suporte a autenticação JWT (opcional)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document); // O Swagger ficará disponível em /api

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
