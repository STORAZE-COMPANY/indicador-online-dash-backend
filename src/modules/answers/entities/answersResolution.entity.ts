import { ApiProperty } from "@nestjs/swagger";
import { AnomalyResolutionStatus } from "../enums";

export class AnomalyResolution {
  @ApiProperty({
    example: "e5b7f1c3-2d4b-4c8a-9c2b-3f6d5e7a8b9c",
    description: "Unique identifier for the anomaly resolution",
  })
  id: string;

  @ApiProperty({
    example: "This is a description of the anomaly resolution.",
    description: "Description of the anomaly resolution",
  })
  description?: string | null;

  @ApiProperty({
    example: "This is a description of the anomaly resolution.",
    description: "Description of the anomaly resolution",
  })
  imageUrl?: string | null;

  @ApiProperty({
    example: "PENDING",
    description: "Status of the anomaly resolution",
    enum: AnomalyResolutionStatus,
  })
  status: AnomalyResolutionStatus;

  @ApiProperty({
    example: 123,
    description: "ID of the employee who approved the anomaly resolution",
  })
  updated_by?: number;

  @ApiProperty({
    example: "e5b7f1c3-2d4b-4c8a-9c2b-3f6d5e7a8b9c",
    description:
      "Unique identifier for the answer associated with the anomaly resolution",
  })
  answer_id: string;

  @ApiProperty({
    example: "2023-10-01T12:00:00Z",
    description: "Timestamp when the anomaly resolution was created",
  })
  created_at: string;

  @ApiProperty({
    example: "2023-10-01T12:00:00Z",
    description: "Timestamp when the anomaly resolution was last updated",
  })
  updated_at: string;
}
