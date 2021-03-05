import { Controller, Get, Post, Body } from '@nestjs/common';


// 引入auth
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService
  ) {}
  @Get()
  getHello(): string {
    return 'hello'
  }
  // 用户注册
  @Post('register')
  async register(@Body() info: object) {
    return await this.authService.create(info);
  }
  // 用户登录
  @Post('login')
  async login(@Body() info: object) {
    return await this.authService.login(info);
  }
}
