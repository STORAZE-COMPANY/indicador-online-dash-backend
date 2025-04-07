import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from "class-validator";

@ValidatorConstraint({ name: "IsStartBeforeEnd", async: false })
export class IsStartBeforeEndConstraint
  implements ValidatorConstraintInterface
{
  validate(_: any, args: ValidationArguments) {
    const obj = args.object as {
      startDate?: string;
      endDate?: string;
    };
    if (!obj.startDate || !obj.endDate) return true;

    const start = new Date(obj.startDate);
    const end = new Date(obj.endDate);

    return start <= end;
  }

  defaultMessage() {
    return `startDate deve ser anterior ou igual a endDate`;
  }
}
