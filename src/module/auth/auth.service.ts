import { Injectable } from '@nestjs/common';


import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// 引入user实体类
import { User } from '../user/user.entity';

import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService
  ) {}

  // 创建用户
  async create(payload) {
    const { username } = payload;
    const user: User = await this.findInfoByUserName(username);
    if (!user) {
      return await this.userRepository.save(payload);
    }
    return {
      code: 600,
      message: '用户名已存在',
    }
  }

  /**
   * 根据用户名 查询用户信息
   * @param username 用户名
   */
  async findInfoByUserName(username: string): Promise<User> {
    return await this.userRepository.findOne({ where: { username } });
  }

  
  /**
   * 登录
   * @param payload 用户信息
   */
  async login(payload) {
    const { username, password } = payload;
    const result = await this.validateUser(username, password);
    if (result.code === 0) {
      return await this.certificate(payload);
    }
    return result;
  }
  /**
   * 验证用户名是否存在
   * @param username 用户名
   */
  async validateUserName(username: string): Promise<boolean> {
    return !!await this.userRepository.findOne({ where: { username } });
  }

  /**
   * 验证用户信息是否正确
   * @param username 用户名
   * @param password 密码
   */
  async validateUser(username: string, password: string): Promise<any> {
    const user: User = await this.userRepository.findOne({ where: { username } });
    if (user) {
      if (user.password === password) {
        return {
          code: 0,
          message: '',
          user
        }
      } else {
        return {
          code: -1,
          message: '密码不正确',
          user: null
        }
      }
    }
    return {
      code: -2,
      message: '用户不存在',
      user: null
    }
  }

  /**
   * 创建token
   * @param user 用户信息
   */
  async certificate(user: any) {
    const { username, password } = user
    const payload = { username, password }
    console.log(user, 'username, id, password, phone')
    try {
      const token = this.jwtService.sign(payload)
      console.log(token, '----token')
      return {
        code: 200,
        data: {
          token
        },
        message: '登录成功'
      }
    } catch (error) {
      return {
        code: 600,
        message: '账号或密码错误'
      }
    }
  }
}
