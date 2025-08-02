import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Task, TaskDocument } from './schemas/create-task.schema';
import { Model } from 'mongoose';
import { CreateTaskDto } from './dto/create-task.dto';
import { FilterTaskDto } from './dto/filter-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';

type TaskQuery = {
  completed?: boolean;
  project?: string;
};

type PaginatedTasks = {
  data: Task[];
  total: number;
  page: number;
  pages: number;
};
@Injectable()
export class TasksService {
  constructor(@InjectModel(Task.name) private taskModel: Model<TaskDocument>) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskModel.create(createTaskDto);
  }

  async findAll(filterTaskDto: FilterTaskDto): Promise<PaginatedTasks> {
    const query: TaskQuery = {};
    if (filterTaskDto.completed !== undefined)
      query.completed = filterTaskDto.completed === 'true';
    if (filterTaskDto.project) query.project = filterTaskDto.project;

    const page = +(filterTaskDto.page ?? 1);
    const limit = +(filterTaskDto.limit ?? 10);
    const skip = (page - 1) * limit;

    const data = await this.taskModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .populate('project');

    const total = await this.taskModel.countDocuments(query);
    return {
      data,
      total,
      page,
      pages: Math.ceil(total / limit),
    };
  }

  async findOne(id: string): Promise<TaskDocument> {
    const task = await this.taskModel.findById(id);
    if (!task) throw new NotFoundException('Task not found');
    return task;
  }

  async update(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const task = await this.findOne(id);
    Object.assign(task, updateTaskDto);
    await task.save();
    return task;
  }

  async remove(id: string) {
    const task = await this.findOne(id);
    task.deleteOne();
  }
}
