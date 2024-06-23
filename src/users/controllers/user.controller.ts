import { Body, Controller, Post } from '@nestjs/common'

import { CreateUserDto } from '../../auth/dto/create-user.dto'
import { UserService } from '../services/user.service'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto)
  }
}
