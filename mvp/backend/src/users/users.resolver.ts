import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { GqlAuthGuard } from 'src/authz/gqlAuthGuard';
import { CurrentUser } from 'src/authz/currentUser';

@Resolver()
export class UsersResolver {
  constructor() {}

  @UseGuards(GqlAuthGuard)
  @Query(() => String)
  async hello(@CurrentUser() user: any) {
    console.log(user);
    return 'hello';
  }
}
