import { Anomalies } from "@modules/checklists/enums/anomaly.enum";
import { ApiProperty } from "@nestjs/swagger";

export class choices {
  @ApiProperty({
    type: String,
  })
  id: string;
  @ApiProperty({
    type: String,
  })
  choice: string;
  @ApiProperty({
    enum: Anomalies,
  })
  anomaly: Anomalies;

  @ApiProperty({
    type: Date,
  })
  created_at: Date;

  @ApiProperty({
    type: String,
  })
  question_id: string;

  @ApiProperty({
    type: Date,
  })
  updated_at: Date;
}
