import { IsEnum, IsString, IsOptional } from 'class-validator';
import { TaskStatus } from "../task.model";

export class GetTaskFilterDto {
    @IsOptional()
    @IsEnum(TaskStatus)
    status?: TaskStatus;

    @IsOptional()
    @IsString()
    search?: string;
};