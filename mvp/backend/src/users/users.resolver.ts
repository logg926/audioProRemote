import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlAuthGuard } from 'src/authz/gqlAuthGuard';
import { CurrentUser } from 'src/authz/currentUser';
import { Sequelize } from 'sequelize-typescript';
import { UsersService } from './users.service';
import { User } from './user.model';
import { UserObject } from '../../../shared/UserObject';
import { UserDto } from '../../../shared/UserDto';
import { Type } from '@nestjs/common';

@Resolver()
export class UsersResolver {
  constructor(private usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => String)
  async hello(@CurrentUser() user: UserObject) {
    console.log(user);
    return 'hi';
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => Type<UserObject>) //sth is wrong here
  async user(@CurrentUser() user: UserObject): Promise<UserDto> {
    const [currentUser, created] = await this.usersService.findOrCreate(
      user.sub,
    );
    return {
      ...currentUser,
      created,
    };
  }
}
