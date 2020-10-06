import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlAuthGuard } from 'src/authz/gqlAuthGuard';
import { CurrentUser } from 'src/authz/currentUser';
import { Sequelize } from 'sequelize-typescript';
import { UsersService } from './users.service';

@Resolver()
export class UsersResolver {
  constructor(usersService: UsersService) {}

  @UseGuards(GqlAuthGuard)
  @Query(() => String)
  async hello(@CurrentUser() user: any) {
    console.log(user);
    return 'hello';
  }
}
