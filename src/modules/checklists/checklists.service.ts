import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from "@nestjs/common";
import {
  CheckList,
  Checklist,
  CheckListMultipleChoice,
  CheckListQuestions,
} from "./entities/checklist.entity";
import { CreateCheckListDto } from "./dtos/create-checklist.dto";
import { UpdateChecklistDto } from "./dtos/update-checklist.dto";
import db from "database/connection";
import {
  CheckListMultipleChoiceFieldsProperties,
  CheckListQuestionFieldsProperties,
  QuestionType,
} from "./enums/question-type.enum";
import { checkListMessages } from "./enums/messages.enum";
import { Knex } from "knex";
import { CheckListItem } from "./entities/checkListItem.entity";
import { BaseMessages } from "@shared/enums";
import { CheckListFieldsProperties } from "./enums/checkList.enum";
import { QuestionsFormatted } from "./interfaces/questions.interface";
import { CheckListQuestionsDto } from "./dtos/question.dto";
import { CheckListItemFieldsProperties } from "./enums/checkListItem.enum";

@Injectable()
export class ChecklistsService {
  async create(dto: CreateCheckListDto): Promise<CheckList> {
    return await db.transaction<CheckList>(async (trx) => {
      const [created] = await trx<CheckList>(
        CheckListFieldsProperties.tableName,
      )
        .insert({
          expiries_in: dto.expiries_in,

          name: dto.name,
        })
        .returning("*");

      const checkListItemCreated = await this.handleCreateCheckListItem(
        {
          categories_id: dto.checkListItem.categoriesId,
          checkList_id: created.id,
        },
        trx,
      );

      const questionsCreated = await this.handleCreateQuestion(
        this.handleBuildQuestionsToInsert(
          dto.checkListItem.question_list,
          checkListItemCreated.id,
        ),
        trx,
      );

      if (
        dto.checkListItem.question_list.some(
          (item) => item.type === QuestionType.MULTIPLE_CHOICE,
        )
      ) {
        const choicesToInsert = this.handleBuildChoicesToInsert(
          dto.checkListItem.question_list,
          questionsCreated,
        );

        await this.handleCreateMultipleChoice(choicesToInsert, trx);
      }

      return created;
    });
  }

  async findAll(): Promise<Checklist[]> {
    const data = await db<Checklist>("checklists").select("*");

    return data.map((item) => ({
      ...item,
      categories: item.categories,
    }));
  }

  async findOne(id: number): Promise<Checklist> {
    const checklist = await db<Checklist>("checklists").where({ id }).first();

    if (!checklist) {
      throw new NotFoundException(BaseMessages.notFound);
    }

    return checklist;
  }

  async update(id: number, dto: UpdateChecklistDto): Promise<Checklist> {
    await this.findOne(id);
    const [updated] = await db<Checklist>("checklists")
      .where({ id })
      .update({
        name: dto.name,
        categories: dto.categories,
        updated_at: db.fn.now(),
      })
      .returning("*");

    return updated;
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await db("checklists").where({ id }).del();
  }

  //Aux functions

  /**
   * Cria um item de checklist no banco de dados utilizando uma transação.
   *
   * @param checkListItem - Objeto parcial contendo os dados do item de checklist a ser criado.
   * @param trx - Instância da transação do Knex para garantir atomicidade na operação.
   * @returns Uma Promise que resolve para o item de checklist criado.
   * @throws InternalServerErrorException - Caso o item de checklist não seja criado com sucesso.
   */
  async handleCreateCheckListItem(
    checkListItem: Partial<CheckListItem>,
    trx: Knex.Transaction,
  ): Promise<CheckListItem> {
    const [created] = await trx<CheckListItem>(
      CheckListItemFieldsProperties.tableName,
    )
      .insert(checkListItem)
      .returning("*");

    if (!created)
      throw new InternalServerErrorException(
        checkListMessages.checkListItemNotCreated,
      );
    return created;
  }

  /**
   * Lida com a criação de perguntas associadas a um item de checklist.
   *
   * @param questions - Array de objetos contendo os dados das perguntas a serem criadas.
   * @param questions[].checkListItem_id - ID do item de checklist ao qual a pergunta está associada.
   * @param questions[].question - Texto da pergunta.
   * @param questions[].type - Tipo da pergunta (definido pelo enum `QuestionType`).
   * @param questions[].isRequired - Indica se a pergunta é obrigatória.
   * @param trx - Transação do Knex utilizada para garantir atomicidade na operação.
   * @returns Uma Promise que resolve para um array de objetos contendo o ID e o tipo das perguntas criadas.
   * @throws InternalServerErrorException - Caso ocorra um erro ao criar as perguntas.
   */
  async handleCreateQuestion(
    questions: {
      checkListItem_id: string;
      question: string;
      type: QuestionType;
      isRequired: boolean;
    }[],
    trx: Knex.Transaction,
  ): Promise<{ id: string; type: string }[]> {
    const created = await trx<CheckListQuestions>(
      CheckListQuestionFieldsProperties.tableName,
    )
      .insert(questions)
      .returning(["id", "question", "type"]);

    if (!created)
      throw new InternalServerErrorException(
        checkListMessages.questionNotCreated,
      );
    return created;
  }

  /**
   * Lida com a criação de múltiplas escolhas associadas a uma pergunta em um checklist.
   *
   * @param multipleChoice - Um array de objetos contendo as informações de cada escolha múltipla.
   *   - `choice` (string): O texto da escolha.
   *   - `isAnomaly` (boolean): Indica se a escolha representa uma anomalia.
   *   - `question_id` (string): O ID da pergunta associada à escolha.
   * @param trx - A transação do Knex a ser utilizada para a operação no banco de dados.
   *
   * @returns Retorna o objeto da escolha múltipla criada.
   *
   * @throws InternalServerErrorException - Lançada caso a criação da escolha múltipla falhe.
   */
  async handleCreateMultipleChoice(
    multipleChoice: {
      choice: string;
      isAnomaly: boolean;
      question_id: string;
    }[],
    trx: Knex.Transaction,
  ) {
    const [multipleChoiceCreated] = await trx<CheckListMultipleChoice>(
      CheckListMultipleChoiceFieldsProperties.tableName,
    )
      .insert(multipleChoice)
      .returning("*");

    if (!multipleChoiceCreated)
      throw new InternalServerErrorException(
        checkListMessages.multipleChoiceNotCreated,
      );
    return multipleChoiceCreated;
  }

  /**
   * Constrói uma lista de perguntas formatadas para serem inseridas no banco de dados.
   *
   * @param questionsFormatted - Array de objetos do tipo `CheckListQuestionsDto` contendo as informações das perguntas.
   * @param checkListItem_id - ID do item do checklist ao qual as perguntas estão associadas.
   * @returns Um array de objetos formatados do tipo `QuestionsFormatted`, prontos para inserção.
   */
  handleBuildQuestionsToInsert(
    questionsFormatted: CheckListQuestionsDto[],
    checkListItem_id: string,
  ): QuestionsFormatted[] {
    return questionsFormatted.map((item) => ({
      checkListItem_id: checkListItem_id,
      isRequired: item.isRequired,
      question: item.question,
      answerType: item.answerType,
      type: item.type,
      IAPrompt: item.iaPrompt,
    }));
  }

  /**
   * Processa uma lista de perguntas e suas escolhas múltiplas para inserção no banco de dados.
   *
   * @param questionList - Lista de perguntas do tipo `CheckListQuestionsDto` contendo os dados originais das perguntas.
   * @param questionsListAfterInsert - Lista de perguntas já inseridas no banco de dados, contendo os campos `id` e `type`.
   *
   * @returns Uma lista de escolhas múltiplas (`CheckListMultipleChoice[]`) formatadas para inserção,
   *          contendo as informações de escolha, se é uma anomalia e o ID da pergunta associada.
   *
   * @remarks
   * - Apenas perguntas do tipo `MULTIPLE_CHOICE` são processadas.
   * - Cada escolha múltipla é associada ao ID da pergunta correspondente.
   * - O método utiliza o índice das perguntas para mapear os IDs gerados após a inserção.
   */
  handleBuildChoicesToInsert(
    questionList: CheckListQuestionsDto[],
    questionsListAfterInsert: {
      id: string;
      type: string;
    }[],
  ): CheckListMultipleChoice[] {
    const questionsWithIds = questionsListAfterInsert
      .map((question, index) => ({
        ...questionList[index],
        id: question.id,
        type: question.type as QuestionType,
      }))
      .filter((question) => question.type === QuestionType.MULTIPLE_CHOICE);

    return questionsWithIds
      .map((item) =>
        (item.multiple_choice || []).map((choice) => ({
          choice: choice.choice,
          isAnomaly: choice.isAnomaly,
          question_id: item.id,
        })),
      )
      .flat();
  }
}
