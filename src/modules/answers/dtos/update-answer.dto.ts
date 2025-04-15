import { ApiProperty } from "@nestjs/swagger";
import { AnomalyResolutionStatus } from "../enums";
import { IsEnum, IsNumber, IsString } from "class-validator";

export class UpdateAnomalyResolutionDTO {
  @ApiProperty({
    example: "e5b7f1c3-2d4b-4c8a-9c2b-3f6d5e7a8b9c",
    description: "Unique identifier for the anomaly resolution",
  })
  @IsString()
  id: string;

  @ApiProperty({
    example: "PENDING",
    description: "Status of the anomaly resolution",
    enum: AnomalyResolutionStatus,
  })
  @IsEnum(AnomalyResolutionStatus)
  status?: AnomalyResolutionStatus;

  @ApiProperty({
    example: 123,
    description: "ID of the employee who approved the anomaly resolution",
  })
  @IsNumber()
  employee_Id?: number;
}
