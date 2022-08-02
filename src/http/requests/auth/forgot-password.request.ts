import { IsDefined, IsEmail, IsNotEmpty, MaxLength } from 'class-validator';

/**
 * Forgot-password validation data.
 */
export class ForgotPasswordRequest {
  @IsDefined()
  @IsNotEmpty()
  @IsEmail()
  @MaxLength(50, {
    message: 'email is too long. Maximal length is $constraint1 characters, but actual is $value',
  })
  readonly email: string;
}
