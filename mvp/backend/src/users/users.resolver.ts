import { Resolver, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Resolver()
export class UsersResolver {
  constructor() {}

  //   @UseGuards(AuthGuard('jwt'))
  @Query(() => String)
  async hello() {
    return 'hello';
  }
}
