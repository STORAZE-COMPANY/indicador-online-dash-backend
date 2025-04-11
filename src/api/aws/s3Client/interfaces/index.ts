import multer from "multer";
import { S3Props, s3Buckets } from "../enum";

export interface multerOptionsProps {
  storage: multer.StorageEngine;
  limits: {
    fileSize: S3Props;
  };
}

export interface fileBaseProps {
  itemId: string;

  bucket: s3Buckets;
}

export interface uploadImageProps extends fileBaseProps {
  file: Express.Multer.File;
}

export interface deleteImageProps {
  fileName: string;
  bucket: s3Buckets;
}

export interface getImageProps {
  bucket: s3Buckets;
  fileName: string;
}

export interface uploadImageResponse {
  url: string;
  fileName: string;
}
