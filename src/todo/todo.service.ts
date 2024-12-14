import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Todo } from './schema/todo.schema';
import { Model, Types } from 'mongoose';
import { User } from 'src/auth/schema/user.schema';
import { createTodoDto } from './dtos/createTodo.dto';

@Injectable()
export class TodoService {
  constructor(
    @InjectModel(Todo.name) private todoModel: Model<Todo>,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async getAllTodos(userId: string) {
    const user = await this.userModel
      .findById(userId)
      .populate({ path: 'todos', model: 'Todo' });
    if (!user) {
      throw new UnauthorizedException('Unauthorized user');
    }
    return {
      todos: user.todos,
    };
  }

  async createTodo(userId: string, createTodoData: createTodoDto) {
    let user = await this.userModel.findById(userId);
    if (!user) {
      throw new UnauthorizedException('Unauthorized user');
    }
    const todo = await this.todoModel.create({
      title: createTodoData.title,
      user: userId,
    });
    await this.userModel.findByIdAndUpdate(userId, {
      $push: { todos: todo._id },
    });
    user = await this.userModel
      .findById(userId)
      .populate({ path: 'todos', model: 'Todo' });
    return {
      todos: user.todos,
    };
  }

  async updateTodo(userId: string, id: string) {
    let user = await this.userModel.findById(userId);
    let todo = await this.todoModel.findById(id);
    if (!user || userId != todo.user.toString()) {
      throw new UnauthorizedException('Unauthorized user');
    }
    await this.todoModel.findByIdAndUpdate(id, { completed: !todo.completed });
    user = await this.userModel
      .findById(userId)
      .populate({ path: 'todos', model: 'Todo' });
    return {
      todos: user.todos,
    };
  }

  async deleteTodo(userId: string, id: string) {
    let user = await this.userModel.findById(userId);
    let todo = await this.todoModel.findById(id);
    if (!user || userId != todo.user.toString()) {
      throw new UnauthorizedException('Unauthorized user');
    }
    await this.todoModel.findByIdAndDelete(id);
    user = await this.userModel
      .findByIdAndUpdate(
        userId,
        {
          $pull: { todos: new Types.ObjectId(id) },
        },
        { new: true },
      )
      .populate({ path: 'todos', model: 'Todo' });
    return {
      todos: user.todos,
    }
  }
}
