import { Controller, Get, Param } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
    constructor(private userService: UserService) {}
    
    @Get('/:userId')
    getByUserId(@Param() pathParams: { userId: string }): Promise<User | null> {
        return this.userService.getByUserId(parseInt(pathParams.userId))
    }
}
