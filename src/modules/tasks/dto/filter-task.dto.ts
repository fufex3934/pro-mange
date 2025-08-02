import { IsBooleanString, IsMongoId, IsOptional } from 'class-validator';

export class FilterTaskDto {
  @IsOptional()
  @IsBooleanString()
  completed?: string;

  @IsOptional()
  @IsMongoId()
  project?: string;

  @IsOptional()
  page?: number;

  @IsOptional()
  limit?: number;
}
