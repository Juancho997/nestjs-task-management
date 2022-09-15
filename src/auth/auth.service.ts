import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
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

        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = this.usersRepository.create({
            username,
            password: hashedPassword
        });

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
    };


    async signIn(authCredentialsDto: AuthCredentialsDto): Promise<string> {
        const { username, password } = authCredentialsDto;
        const user = await this.usersRepository.findOne({
            where: {
                username: username
            }
        });

        if (user && (await bcrypt.compare(password, user.password))) {
            return 'success';
        } else {
            throw new UnauthorizedException('Please check your login credentials')
        }
    }


}
