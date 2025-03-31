import { NestFactory } from "@nestjs/core";
import { AppModule } from "@app/app.module";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ApiSwaggerDescription } from "@shared/enums";
import { ValidationPipe } from "@nestjs/common";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: "*",
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle(ApiSwaggerDescription.title)
    .setDescription(ApiSwaggerDescription.description)
    .setVersion(ApiSwaggerDescription.version)
    .addBearerAuth() // Adiciona suporte a autenticação JWT (opcional)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api", app, document); // O Swagger ficará disponível em /api
  // Expondo o JSON do Swagger na rota /api-json
  app
    .getHttpAdapter()
    .get("/api-json", (req: any, res: { json: (body: any) => void }) => {
      res.json(document);
    });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
