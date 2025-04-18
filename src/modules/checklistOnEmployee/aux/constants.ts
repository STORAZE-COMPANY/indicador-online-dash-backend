export const selectQueryForCheckListWithQuestions = `
          DISTINCT ON ("questions"."id")
            "checkList"."id" as "checkListId",
            "checkList"."name" as "checkListName",
            "questions"."id" as "questionId",
            "questions"."question" as "question",
            "answers"."id" as "answerId",
            "answers"."textAnswer",
            "answers"."imageAnswer",
            "answers"."anomalyStatus",
            "questionsChoices"."id" as "choiceId",
            "questionsChoices"."choice" as "choice",
            "answerChoice"."id" as "answerChoiceId",
            "answerChoice"."employee_id",
            "questionsChoices"."anomalyStatus" as "anomalyChoiceStatus",
            CASE
              WHEN "answers"."id" IS NOT NULL 
                OR "answerChoice"."id" IS NOT NULL
              THEN true
              ELSE false
            END AS answered
        `;
