import OpenAI from "openai";
import { OpenIA } from "./enum";

export const client = new OpenAI({
  apiKey: process.env.OPEN_IA_SECRET,
});

/**
 * Obtém uma resposta do modelo de IA baseado no prompt fornecido e no tipo de conteúdo da resposta do usuário.
 *
 * @param {Object} params - Parâmetros para a função.
 * @param {string} params.prompt - O prompt a ser enviado para o modelo de IA.
 * @param {ResponseInputMessageContentList} params.userResponseContentType - O tipo de conteúdo da resposta do usuário.
 *
 * @returns {Promise<string>} - Retorna uma promessa que resolve com o texto de saída gerado pelo modelo de IA.
 */
export async function getChatResponse<T>({
  inputDataToSend,
}: {
  inputDataToSend: OpenAI.Responses.ResponseInput;
}): Promise<T> {
  const response = await client.responses.create({
    model: OpenIA.ia_model,
    input: inputDataToSend,
  });
  return response.output_text.trim().replace(/\.$/, "") as T;
}
