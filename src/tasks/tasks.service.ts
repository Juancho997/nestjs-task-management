import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTaskFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(Task)
        // Custom repository ex @EntityRepository
        private tasksRepository: Repository<Task>,
    ) { }

    async getTasks(filterDto: GetTaskFilterDto): Promise<Task[]> {
        const { status, search } = filterDto;
        const query = this.tasksRepository.createQueryBuilder('task');

        if (status) {
            query.andWhere('task.status = :status', { status });
        }

        if (search) {
            query.andWhere(
                'LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search)',
                { search: `%${search}%` }
            )
        }


        const tasks = await query.getMany();
        return tasks;
    }

    async getTaskById(id: string): Promise<Task> {
        const found = await this.tasksRepository.findOne({
            where: {
                id: id
            }
        });

        if (!found) {
            throw new NotFoundException(`Task with ID : ${id} not found!`);
        }

        return found;
    }

    async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
        const { title, description } = createTaskDto;

        const task = this.tasksRepository.create({
            title,
            description,
            status: TaskStatus.OPEN
        });

        await this.tasksRepository.save(task);
        return task;

    };

    async deleteTask(id: string): Promise<void> {
        const deleteResult = await this.tasksRepository.delete(id);

        if (deleteResult.affected === 1) {
            throw new NotFoundException(`Task with ID : '${id}' not found`);
        };

    };

    async updateTask(id: string, status: TaskStatus): Promise<Task> {
        const task = await this.getTaskById(id);

        task.status = status;
        await this.tasksRepository.save(task);

        return task;
    }
}
