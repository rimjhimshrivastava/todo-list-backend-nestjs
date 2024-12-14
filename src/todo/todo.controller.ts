import { Body, Controller, Delete, Get, Param, Post, Put, Request, UnauthorizedException } from '@nestjs/common';
import { TodoService } from './todo.service';
import { AuthService } from 'src/auth/auth.service';
import { createTodoDto } from './dtos/createTodo.dto';

@Controller('todo')
export class TodoController {
  constructor(
    private readonly todoService: TodoService,
    private readonly authService: AuthService,
  ) {}

  /*
    extracts access token from header, 
    decodes it to obtain user id for authentication
    and passes it to todo service
  */
  @Get()
  async getAllTodos(@Request() req) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Invalid user');
    }
    const userId = await this.authService.decodeToken(token);
    return this.todoService.getAllTodos(userId);
  }

  @Post()
  async createTodo(@Request() req, @Body() createTodoData: createTodoDto) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Authorization token missing');
    }
    const userId = await this.authService.decodeToken(token);
    return this.todoService.createTodo(userId, createTodoData);
  }

  @Put(':id')
  async updateTodo(@Request() req, @Param('id') id: string){
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Authorization token missing');
    }
    const userId = await this.authService.decodeToken(token);
    return this.todoService.updateTodo(userId, id);
  }

  @Delete(':id')
  async deleteTodo(@Request() req, @Param('id') id: string){
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
      throw new UnauthorizedException('Authorization token missing');
    }
    const userId = await this.authService.decodeToken(token);
    return this.todoService.deleteTodo(userId, id);
  }
}
