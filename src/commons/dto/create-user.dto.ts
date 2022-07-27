export class CreateUserDto {
  readonly firstName: string;
  readonly email: string;
  password: string;
  readonly age: number;
  role_id?: number;
  token_id: string;
}
