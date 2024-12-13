import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { SignupDto } from './dtos/signup.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './user.schema';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private UserModel: Model<User>,
    private readonly jwtService: JwtService,
  ) {}

  async signup(signupData: SignupDto) {
    const { username, password } = signupData;
    const isUsernameNotUnique = await this.UserModel.findOne({
      username: username,
    });
    if (isUsernameNotUnique) {
      throw new BadRequestException('Username already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await this.UserModel.create({
      username,
      password: hashedPassword,
    });
    return this.generateUserTokens(user._id);
  }

  async login(credentials: SignupDto) {
    const { username, password } = credentials;
    const user = await this.UserModel.findOne({ username });
    if (!user) {
      throw new UnauthorizedException('Invalid Username/Password');
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      throw new UnauthorizedException('Invalid Username/Password');
    }
    return this.generateUserTokens(user._id);
  }

  async generateUserTokens(userId) {
    const accessToken = this.jwtService.sign({ userId }, { expiresIn: '1h' });
    return {
      accessToken,
    };
  }
}
