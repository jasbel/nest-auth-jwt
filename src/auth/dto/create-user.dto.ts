import { IsEmail, IsString, MinLength, isString } from "class-validator";

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @MinLength(8)
  password: string;
}
