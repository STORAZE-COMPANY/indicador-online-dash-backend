import {
  Controller,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import {
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiTags,
} from "@nestjs/swagger";

import { ImagesService } from "./images.service";

import { ImagesRoutes } from "./enums";
import { FileInterceptor } from "@nestjs/platform-express";
import { UploadImageResponseDto } from "./dtos/responses.dto";
import { UploadFileDto } from "./dtos/create.dto";

@Controller(ImagesRoutes.baseUrl)
@ApiTags(ImagesRoutes.tags)
export class ImagesController {
  constructor(private readonly service: ImagesService) {}

  @Post()
  @UseInterceptors(FileInterceptor("file"))
  @ApiCreatedResponse({
    type: UploadImageResponseDto,
  })
  @ApiBody({ type: UploadFileDto })
  @ApiConsumes("multipart/form-data")
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return this.service.uploadImage(file);
  }
}
