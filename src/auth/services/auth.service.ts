import {
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'

import { UserService } from '../../users/services/user.service'
import { CreateUserDto } from '../dto/create-user.dto'
import { LoginUserDto } from '../dto/login-user.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService
  ) {}

  private async validateUser(email: string, password: string) {
    const user = await this.userService.findOneByEmail(email)

    if (!user) {
      throw new NotFoundException(`User with email '${user.email}' not exist`)
    }

    const isValidPassword = await bcrypt.compare(password, user.password)

    if (isValidPassword) {
      return {
        userId: user.userId,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }
    }

    return null
  }

  public async login(user: LoginUserDto) {
    const validatedUser = await this.validateUser(user.email, user.password)

    if (!validatedUser) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const payload = { sub: validatedUser.userId }

    return {
      data: validatedUser,
      token: this.jwtService.sign(payload)
    }
  }

  public async register(createUserDto: CreateUserDto) {
    const userData = await this.userService.create(createUserDto)

    return userData
  }
}
