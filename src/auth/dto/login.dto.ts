import { IsEmail, IsString, MinLength, isString } from "class-validator";

export class LoginDto {
  @IsEmail()
  email: string;

  @MinLength(8)
  password: string;
}
