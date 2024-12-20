import { Injectable, NotFoundException } from '@nestjs/common';
import { Task } from './task.model';
import { TaskStatus } from './task.model';
import { v4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks.filter.dto';
@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let tasks: Task[] = this.getAllTasks();
    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter((task) => {
        if (task.title.includes(search) || task.description.includes(search)) {
          return true;
        }
        return false;
      });
    }

    return tasks;
  }

  getTaskById(id: string): Task {
    const found = this.tasks.find((task) => task.id === id);

    if (!found) {
      throw new NotFoundException(`Task with "${id}" not found`);
    }

    return found;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: v4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  deleteTask(id: string): void {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const found = this.getTaskById(id);
    this.tasks = this.tasks.filter((task) => task.id !== id);
  }

  updateTask(id: string, createTaskDto: CreateTaskDto): Task {
    const task = this.getTaskById(id);
    if (!task) {
      throw new Error('Task not found');
    }
    const { title, description } = createTaskDto;
    task.title = title;
    task.description = description;

    return task;
  }

  updateTaskStatus(id: string, status: TaskStatus) {
    const task = this.getTaskById(id);
    if (!task) {
      throw new Error('Task not found');
    }
    task.status = status;
    return task;
  }
}
