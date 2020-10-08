import { User } from './user.model';
import {
  Column,
  DataType,
  Default,
  ForeignKey,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

export interface SessionObject {
  id: string;
  creatorId: string;
}
@Table
export class Session extends Model<Session> implements SessionObject {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @ForeignKey(() => User)
  @Column(DataType.UUID)
  creatorId: string;
}
