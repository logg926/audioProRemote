import {
  Column,
  DataType,
  Default,
  HasMany,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { Session } from './session.model';
import { UserObject } from '../../../shared/UserObject';

@Table
export class User extends Model<User> implements UserObject {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Column
  sub: string;

  @HasMany(() => Session)
  players: Session[];
}
