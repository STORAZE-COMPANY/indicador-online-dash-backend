import {
  ReferenceObject,
  SchemaObject,
} from "@nestjs/swagger/dist/interfaces/open-api-spec.interface";

export const schema: SchemaObject | ReferenceObject = {
  type: "object",
  properties: {
    image: {
      type: "string",
      format: "binary",
    },
    question_id: {
      type: "string",
    },
    employee_id: {
      type: "string",
    },
  },
};

export const schemaAnomalyResolution: SchemaObject | ReferenceObject = {
  type: "object",
  properties: {
    image: {
      type: "string",
      format: "binary",
    },
    description: {
      type: "string",
    },
    answer_id: {
      type: "string",
    },
  },
};
