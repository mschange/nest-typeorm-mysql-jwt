import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

// 引入typeorm
import { TypeOrmModule } from '@nestjs/typeorm';
// 引入用户的实体类
import { User } from '../user/user.entity';

import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';

import { UserService } from '../user/user.service';

import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';

import { jwtConstants } from '../../config/jwt.config';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, JwtStrategy, UserService]
})
export class AuthModule {}