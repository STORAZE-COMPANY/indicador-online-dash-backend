import { Client } from "minio";
import { UploadImageMinioResponse } from "./interface";
import { Buckets, imagesProps } from "./enum";

const minio = new Client({
  endPoint: "minio",
  port: 9000,
  useSSL: false,
  accessKey: "minioadmin",
  secretKey: "minioadmin",
});
export async function uploadImage(
  file: Express.Multer.File,
): Promise<UploadImageMinioResponse> {
  const bucket = Buckets.indicadorOnlineImages;
  const { fileName, filePath } = buildFileToUpload(file, bucket);

  await minio.putObject(bucket, fileName, file.buffer, undefined, {
    "Content-Type": file.mimetype,
  });
  const url = await minio.presignedGetObject(
    bucket,
    fileName,
    imagesProps.expirationTimeOneHour,
    {
      "response-content-disposition": "inline",
      "response-content-type": file.mimetype,
    },
  );
  return {
    url,
    imagePath: filePath,
  };
}
function buildFileToUpload(
  { originalname }: Express.Multer.File,
  bucket: string,
): {
  fileName: string;
  filePath: string;
} {
  const fileName = `images/${Date.now()}-${originalname}`;
  const filePath = `${bucket}/${fileName}`;

  return {
    fileName,
    filePath,
  };
}
