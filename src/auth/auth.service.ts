import { ConflictException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>
    ) { }

    async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void> {
        const { username, password } = authCredentialsDto;

        const user = this.usersRepository.create({
            username,
            password
        })

        try {
            await this.usersRepository.save(user);

        } catch (error) {
            if (error.code === '23505') { //duplicated username
                throw new ConflictException('Username alredy exists');
            } else {
                // other errors
                throw new InternalServerErrorException();
            }

        }
        console.log('User created!')
    }


}