import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectAclCommand,
} from "@aws-sdk/client-s3";
import { extname } from "path";
import {
  deleteImageProps,
  getImageProps,
  uploadImageProps,
  uploadImageResponse,
} from "./interfaces";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Props } from "./enum";

/**
 * Cria e configura uma instância do cliente S3 da AWS.
 *
 * Este cliente é utilizado para interagir com o serviço Amazon S3, permitindo operações
 * como upload, download e gerenciamento de objetos em buckets S3.
 *
 * @constant
 * @type {S3Client}
 *
 * @property {string} region - A região da AWS onde o bucket S3 está localizado.
 * O valor é obtido da variável de ambiente `AWS_REGION`.
 *
 * @property {Object} credentials - As credenciais de autenticação para acessar o serviço S3.
 * @property {string} credentials.accessKeyId - O ID da chave de acesso da AWS, obtido da variável de ambiente `AWS_ACCESS_KEY_ID`.
 * @property {string} credentials.secretAccessKey - A chave secreta de acesso da AWS, obtida da variável de ambiente `AWS_SECRET_ACCESS_KEY`.
 *
 * @remarks
 * Certifique-se de que as variáveis de ambiente `AWS_REGION`, `AWS_ACCESS_KEY_ID` e `AWS_SECRET_ACCESS_KEY`
 * estejam devidamente configuradas antes de utilizar este cliente. Caso contrário, o cliente será inicializado
 * com valores padrão vazios, o que pode causar falhas nas operações.
 */
const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

/**
 * Faz o upload de uma imagem para um bucket S3 da AWS.
 *
 * @param {uploadImageProps} params - Parâmetros necessários para o upload da imagem.
 * @param {Express.Multer.File} params.file - Arquivo a ser enviado, contendo informações como buffer e mimetype.
 * @param {string} params.itemId - Identificador único do item, usado para nomear o arquivo no bucket.
 * @param {string} params.bucket - Nome do bucket S3 onde o arquivo será armazenado.
 * @returns {Promise<string>} URL pública do arquivo enviado.
 *
 * @throws {Error} Caso ocorra algum problema durante o envio do arquivo para o S3.
 */
export async function uploadImage({
  file,
  itemId,
  bucket,
}: uploadImageProps): Promise<uploadImageResponse> {
  const fileExtension = extname(file.originalname);
  const fileNameToUpload = `${itemId}${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: fileNameToUpload,
    Body: file.buffer,
    ContentType: file.mimetype,
  });

  await s3Client.send(command);
  return {
    url: `https://${bucket}.s3.amazonaws.com/${fileNameToUpload}`,
    fileName: fileNameToUpload,
  };
}

/**
 * Exclui uma imagem de um bucket S3 especificado.
 *
 * @param {Object} params - Parâmetros para exclusão da imagem.
 * @param {string} params.bucket - Nome do bucket S3 onde a imagem está armazenada.
 * @param {string} params.fileName - Nome do arquivo (chave) da imagem a ser excluída.
 * @returns {Promise} Retorna uma Promise que resolve quando o comando de exclusão é enviado ao S3.
 */
export async function deleteImage({ bucket, fileName }: deleteImageProps) {
  const command = new DeleteObjectCommand({
    Bucket: bucket,
    Key: fileName,
  });

  return await s3Client.send(command);
}

/**
 * Obtém a URL assinada de uma única imagem armazenada no Amazon S3.
 *
 * @param {Object} params - Parâmetros necessários para obter a URL da imagem.
 * @param {string} params.bucket - Nome do bucket S3 onde a imagem está armazenada.
 * @param {string} params.fileName - Nome do arquivo da imagem no bucket S3.
 * @returns {Promise<string>} Uma Promise que resolve para a URL assinada da imagem.
 *
 * @remarks
 * A URL assinada é gerada com base no tempo de expiração configurado em `S3Props.expiries_time_singed_url`.
 *
 * @throws {Error} Lança um erro caso ocorra algum problema ao gerar a URL assinada.
 */
export async function getSignedImageUrl({
  bucket,
  fileName,
}: getImageProps): Promise<string> {
  const command = new GetObjectAclCommand({
    Bucket: bucket,
    Key: fileName,
  });

  return await getSignedUrl(s3Client, command, {
    expiresIn: Number(S3Props.expiries_time_singed_url),
  });
}
