import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { UsersModule } from './users/users.module';

import { ConfigModule } from '@nestjs/config';
import { AuthzModule } from './authz/authz.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from './users/user.model';
import { Session } from './users/session.model';

@Module({
  imports: [
    ConfigModule.forRoot(),
    GraphQLModule.forRoot({
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
      // debug: false,
      context: ({ req }) => ({ req }),
      // playground: false,
    }),
    UsersModule,
    AuthzModule,

    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: process.env.DB_HOST_ADDRESS,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_USER_NAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      models: [User, Session],

      // autoLoadModels: true,
      synchronize: true,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
