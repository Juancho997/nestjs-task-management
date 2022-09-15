import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';


@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    // @Get()

    @Post('/signup')
    signUp(
        @Body() authCredentialsDto: AuthCredentialsDto
    ): Promise<void> {
        return this.authService.signUp(authCredentialsDto)
    };

    @Post('/signin')
    signIn(
        @Body() authCredentialsDto: AuthCredentialsDto
    ): Promise<string> {
        return this.authService.signIn(authCredentialsDto)
    };
}
