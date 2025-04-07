import OpenAI from "openai";
import { ResponseInputMessageContentList } from "openai/resources/responses/responses";
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
export async function getChatResponse({
  prompt,
  userResponseContentType,
}: {
  userResponseContentType: ResponseInputMessageContentList;
  prompt: string;
}) {
  const response = await client.responses.create({
    model: OpenIA.ia_model,
    input: [
      {
        role: OpenIA.ia_system,
        content: prompt,
      },
      {
        role: OpenIA.user,
        content: userResponseContentType,
      },
    ],
  });
  return response.output_text;
}
