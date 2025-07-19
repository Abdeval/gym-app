import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { SignUpDto, SignInDto, ChangePasswordDto } from './dto';
import { ConfigService } from '@nestjs/config';
import { PrismaClientKnownRequestError } from 'shared/prisma/runtime/library';

@Injectable()
export class AuthService {
  constructor(
    private config: ConfigService,
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}
  async signup(dto: SignUpDto) {
    try {
      const hash = await argon.hash(dto.password);
      console.log('dto: ', dto);
      const user = await this.prisma.user.create({
        data: {
          //   firstName: dto.firstName,
          //   lastName: dto.lastName,
          email: dto.email,
          password: hash,
          name: dto.name || 'default',
        },
      });

      // console.log(user);
      console.log(user.name, ' => signed up');
      const token = await this.signToken(user.id, user.email);
      return {
        // role: user.role,
        access_token: token,
      };
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Email already exists');
        }
      }
      throw error;
    }
  }

  async signin(dto: SignInDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });
    if (!user) {
      throw new ForbiddenException('Email not found');
    }
    if (!user.password) {
      throw new ForbiddenException('Password missing');
    }
    const valid = await argon.verify(user.password, dto.password);
    if (!valid) {
      throw new ForbiddenException("Password doesn't match");
    }

    console.log(user.name, ' => signed in');
    // console.log(user);
    const token = await this.signToken(user.id, user.email);
    return {
      // role: user.role,
      access_token: token,
    };
  }

  // ! change password
  async changePassword(userId: string, dto: ChangePasswordDto) {
    if (!userId) throw new ForbiddenException('Not authorized..!');

    if (dto.newPassword !== dto.confirmNewPassword)
      throw new NotFoundException('passwords are not valid');

    const user = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) throw new NotFoundException('user not found');

    const valid = await argon.verify(user?.password, dto.currentPassword);

    if (!valid) {
      throw new ForbiddenException("Password doesn't match");
    }

    const newHasedPassword = await argon.hash(dto.newPassword);

    return await this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        password: newHasedPassword,
      },
    });
  }

  async signToken(
    id: string,
    email: string,
    // role: Role,
  ): Promise<string> {
    const payload = { sub: id, email };

    const secret = this.config.get<string>('JWT_SECRET');

    const token = await this.jwtService.signAsync(payload, { secret });
    return token;
  }
}
