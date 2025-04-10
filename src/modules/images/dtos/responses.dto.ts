import { ApiProperty } from "@nestjs/swagger";
import { imagesMessages } from "../enums";
import { IsEnum } from "class-validator";

export class UploadImageResponseDto {
  @ApiProperty({
    description: imagesMessages.uploadSuccess,
  })
  @IsEnum(imagesMessages)
  message: imagesMessages;
  @ApiProperty({
    description: imagesMessages.url,
  })
  url: string;
}
export class SaveImageResponseDto extends UploadImageResponseDto {
  @ApiProperty({
    description: imagesMessages.imagePath,
  })
  imagePath: string;
}
