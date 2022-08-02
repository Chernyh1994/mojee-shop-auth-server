/**
 * CreateUserDto class.
 */
export class CreateUserDto {
  readonly email: string;
  password: string;
  role_id?: number;
}
