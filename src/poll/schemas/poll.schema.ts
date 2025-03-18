import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from "mongoose";

@Schema()
export class Option {
  @Prop({required: true})
  text: string;

  @Prop({default: 0 })
  votes: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  votedBy: Types.ObjectId[];
}

@Schema()
export class Poll extends Document {
  @Prop({required: true})
  title: string;

  @Prop({required:true, unique: true})
  options: Option[];

  @Prop({required: true, unique: true})
  joinCode: string;

  @Prop({ default: 'pending' })
  status: 'pending' | 'active' | 'closed';

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  owner: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  participants: Types.ObjectId[];

}

export const PollSchema = SchemaFactory.createForClass(Poll);
