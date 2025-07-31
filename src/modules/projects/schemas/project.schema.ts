import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

export type ProjectsDocument = HydratedDocument<Projects>;

@Schema({ timestamps: true })
export class Projects {
  @Prop({ required: true })
  name: string;

  @Prop()
  description: string;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;
}

export const ProjectsSchema = SchemaFactory.createForClass(Projects);
