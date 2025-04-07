import { registerDecorator, ValidationOptions } from "class-validator";

export function IsNonBlankString({
  isOptional,
  validationOptions,
}: {
  validationOptions?: ValidationOptions;
  isOptional?: boolean;
}) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: "isNonBlankString",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: string) {
          if (isOptional) {
            if (value === undefined || value === null) {
              return true; // Se o valor for opcional e não estiver presente, é considerado válido
            }
          }
          return typeof value === "string" && value.trim().length > 0;
        },
        defaultMessage(): string {
          return (
            "O valor deve ser uma string não vazia e sem apenas espaços em branco. Field: " +
            propertyName
          );
        },
      },
    });
  };
}
