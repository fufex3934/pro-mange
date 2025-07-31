import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { UserDocument, UserRole } from '../users/schemas/user.schema';
import { CreateProjectDto } from './dto/create-project.dto';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import { UpdateProjectDto } from './dto/update-project.dto';
import { DeleteResult } from 'mongoose';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private projectsService: ProjectsService) {}

  @Post()
  @Roles(UserRole.USER, UserRole.ADMIN)
  async create(
    @Body() createProjetDto: CreateProjectDto,
    @CurrentUser() user: UserDocument,
  ) {
    return await this.projectsService.create(createProjetDto, user);
  }

  @Get()
  async findAll(@CurrentUser() user: UserDocument) {
    return await this.projectsService.findAll(user);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: UserDocument) {
    return await this.projectsService.findOne(id, user);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    updateProjectDto: UpdateProjectDto,
    @CurrentUser() user: UserDocument,
  ) {
    return await this.projectsService.update(id, updateProjectDto, user);
  }
  @Delete(':id')
  @Roles(UserRole.ADMIN, UserRole.USER)
  async remove(
    @Param('id') id: string,
    @CurrentUser() user: UserDocument,
  ): Promise<DeleteResult> {
    return await this.projectsService.remove(id, user);
  }
}
