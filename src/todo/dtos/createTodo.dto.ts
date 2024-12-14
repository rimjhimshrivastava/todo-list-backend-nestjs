import { IsString } from "class-validator";

export class createTodoDto{
    @IsString()
    title: string;
}