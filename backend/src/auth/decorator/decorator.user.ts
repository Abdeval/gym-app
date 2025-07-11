import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { IsEmail, IsEnum, IsString } from 'class-validator';

export const User = createParamDecorator(
  (data: string | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();

    if (data) return request.user[data];

    return request.user;
  },
);

export class UserDecorator {
  @IsString()
  id: string;

  @IsEmail()
  email: string;
}
