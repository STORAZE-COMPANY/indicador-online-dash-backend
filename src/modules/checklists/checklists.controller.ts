import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  ParseIntPipe,
} from "@nestjs/common";
import { ChecklistsService } from "./checklists.service";
import { CreateChecklistDto } from "./dtos/create-checklist.dto";
import { UpdateChecklistDto } from "./dtos/update-checklist.dto";

@Controller("checklists")
export class ChecklistsController {
  constructor(private readonly service: ChecklistsService) {}

  @Post()
  create(@Body() dto: CreateChecklistDto) {
    console.log("dto", JSON.stringify(dto));
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(":id")
  findOne(@Param("id", ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(":id")
  update(
    @Param("id", ParseIntPipe) id: number,
    @Body() dto: UpdateChecklistDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(":id")
  remove(@Param("id", ParseIntPipe) id: number) {
    this.service.remove(id);
    return { message: "Checklist removido com sucesso" };
  }
}
