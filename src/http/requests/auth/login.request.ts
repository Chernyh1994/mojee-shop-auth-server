import {
  IsDefined,
  IsEmail,
  IsNotEmpty,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class LoginRequest {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50, {
    message:
      'email is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  readonly email: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  @MaxLength(50, {
    message:
      'password is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  @MinLength(8, {
    message:
      'password is too short. Minimal is $constraint1 characters, but actual is $value',
  })
  @Matches(
    /((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-z]).*$/,
    {
      message:
        'password must contain an uppercase letter, one number and one symbol !@#$%^&*',
    },
  )
  readonly password: string;
}
