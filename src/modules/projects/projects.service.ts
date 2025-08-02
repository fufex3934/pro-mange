import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Project, ProjectDocument } from './schemas/project.schema';
import { DeleteResult, Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { UserDocument, UserRole } from '../users/schemas/user.schema';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectModel(Project.name) private ProjectModel: Model<ProjectDocument>,
  ) {}

  async create(
    createProjectDto: CreateProjectDto,
    user: UserDocument,
  ): Promise<Project> {
    return this.ProjectModel.create({ ...createProjectDto, owner: user._id });
  }

  async findAll(user: UserDocument): Promise<Project[]> {
    return this.ProjectModel.find({ owner: user._id }).lean();
  }

  async findOne(id: string, user: UserDocument): Promise<ProjectDocument> {
    const project = await this.ProjectModel.findById(id);
    if (!project) throw new NotFoundException('Project not found');
    const isOwner = project.owner.equals(user._id);
    const isAdmin = user.role === UserRole.ADMIN;
    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You can only access your own project');
    }
    return project;
  }

  async update(
    id: string,
    updateProjectDto: UpdateProjectDto,
    user: UserDocument,
  ): Promise<ProjectDocument | null> {
    const project = await this.findOne(id, user);
    Object.assign(project, updateProjectDto);
    await project.save();
    return this.ProjectModel.findById(project._id).lean();
  }

  async remove(id: string, user: UserDocument): Promise<DeleteResult> {
    const project = await this.findOne(id, user);
    return project.deleteOne();
  }

  async uploadCover(id: string, filename: string, user: UserDocument) {
    const project = await this.findOne(id, user);
    project.coverImageUrl = `/uploads/${filename}`;
    await project.save();
    return this.ProjectModel.findById(project._id);
  }
}
