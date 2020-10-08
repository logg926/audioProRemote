import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './user.model';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
  ) {}

  // async findAll(): Promise<User[]> {
  //   return this.userModel.findAll();
  // }

  // findOne(id: string): Promise<User> {
  //   return this.userModel.findOne({
  //     where: {
  //       id,
  //     },
  //   });
  // }
  async findOrCreate(sub: string): Promise<[User, boolean]> {
    const [user, created] = await this.userModel.findOrCreate({
      where: {
        sub,
      },
    });

    return [user, created];
  }

  // async remove(id: string): Promise<void> {
  //   const user = await this.findOne(id);
  //   await user.destroy();
  // }
}
