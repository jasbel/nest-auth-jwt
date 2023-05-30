import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './entities/user.entity';
import { Model } from 'mongoose';

import * as bcryptjs from 'bcryptjs';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
    private jwtService: JwtService,
  ) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const { password, ...userData } = createUserDto;

      const newData = new this.userModel({
        password: bcryptjs.hashSync(password, 10),
        ...userData,
      });

      await newData.save();

      const { password: _, ...user } = newData.toJSON();

      return user;
    } catch (error) {
      if (error.code === 1100) {
        throw new BadRequestException(`${createUserDto.email} already exist`);
      }

      throw new InternalServerErrorException('Somethin terrilble happend!!');
    }
  }

  async login(loginDto: LoginDto) {
    try {
      const { password, email } = loginDto;

      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new UnauthorizedException('Not Valid credentials - email');
      }

      if (!bcryptjs.compareSync(password, user.password)) {
        throw new UnauthorizedException('Not Valid credentials - password');
      }

      const { password: _, ...res } = user.toJSON();

      return { user: res, token: this.getJwt({ id: user.id }) };
    } catch (error) {
      if (error.code === 1100) {
        throw new BadRequestException(`${loginDto.email} already exist`);
      }

      throw new InternalServerErrorException('Somethin terrilble happend!!');
    }
  }

  findAll() {
    return `This action returns all auth`;
  }

  findOne(id: number) {
    return `This action returns a #${id} auth`;
  }

  update(id: number, updateAuthDto: UpdateAuthDto) {
    return `This action updates a #${id} auth`;
  }

  remove(id: number) {
    return `This action removes a #${id} auth`;
  }

  getJwt(payload: JwtPayload) {
    const token = this.jwtService.signAsync(payload);
    return token;
  }
}
