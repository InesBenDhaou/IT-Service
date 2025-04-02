import { Body, UploadedFile, Controller, Get, Patch, HttpStatus, Post, Req, Res, UseGuards, Delete, Param, Put, UseInterceptors } from "@nestjs/common";
import { JwtAuthGuard } from "src/jwt/jwt.guard";
import { DeleteResult } from "typeorm";
import { Roles } from "src/decorators/role.decorator";
import { RoleGuard } from "src/guards/role.guard";
import { KnowledgebaseService } from "./knowledgebase.service";
import { Knowledgebase } from "./Entity/knowledgebase.entity";
import { KnowledgeDTO, KnowledgeTechnicienDTO } from "./DTO/knowledgecreate.dto";
import { KnowledgebaseUpdateDTO } from "./DTO/knowledgeupdate.dto";

@Controller('knowledgebase')
export class KnowledgebaseController {
    constructor(private readonly knowledgebaseService: KnowledgebaseService) { }

    @UseGuards(JwtAuthGuard)
    @Get()
    findAll(): Promise<Knowledgebase[]> {
        return this.knowledgebaseService.findAll();
    }

    @UseGuards(JwtAuthGuard)
    @Get('confirmed')
    findConfirmed(): Promise<Knowledgebase[]> {
        return this.knowledgebaseService.findConfirmed();
    }

    @UseGuards(JwtAuthGuard)
    @Get('unconfirmed')
    findNoneConfirmed(): Promise<Knowledgebase[]> {
        return this.knowledgebaseService.findNoneConfirmed();
    }

    @UseGuards(JwtAuthGuard)
    @Get('knowledge/:id')
    findOne(@Param('id') id: number): Promise<Knowledgebase> {
        return this.knowledgebaseService.findOne(id);
    }

    @Roles('planificateur')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post('create')
    create(
        @Body() knowledge: KnowledgeDTO
    ): Promise<KnowledgeDTO> {
        return this.knowledgebaseService.create(knowledge);
    }

    @Roles('technicien')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Post('createByTechnicien')
    createByTechnicien(
        @Body() knowledge: KnowledgeTechnicienDTO
    ): Promise<Knowledgebase> {
        return this.knowledgebaseService.createByTechnicien(knowledge);
    }


    @Roles('planificateur')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Patch(':id/confirm')
    async confirmTuto(@Param('id') id: number): Promise<void> {
        return this.knowledgebaseService.updateConfirmationStatus(id);
    }

    @Roles('planificateur')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Put('update/:id')
    update(@Body() knowledge: KnowledgebaseUpdateDTO, @Param('id') id: number): Promise<Knowledgebase> {
        return this.knowledgebaseService.update(id, knowledge);
    }

    @Roles('planificateur')
    @UseGuards(JwtAuthGuard, RoleGuard)
    @Delete('delete/:id')
    delete(@Param('id') id: number): Promise<DeleteResult> {
        return this.knowledgebaseService.delete(id);
    }

    @Delete('delete')
    deleteall(): Promise<DeleteResult> {
        return this.knowledgebaseService.deleteAll();
    }

}

