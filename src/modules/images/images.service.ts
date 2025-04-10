import { Injectable } from "@nestjs/common";
import { imagesMessages } from "./enums";

import { UploadImageResponseDto } from "./dtos/responses.dto";
import { uploadImage } from "api/minioClient";
@Injectable()
export class ImagesService {
  async uploadImage(
    file: Express.Multer.File,
  ): Promise<UploadImageResponseDto> {
    const { url } = await uploadImage(file);
    return {
      message: imagesMessages.uploadSuccess,
      url,
    };
  }
}
