export class CreateUserDto {
  readonly email: string;
  password: string;
  is_verified: boolean;
  is_deleted: boolean;
  role_id: number;
  readonly profile_id: number;
  readonly created_at: Date;
  readonly updated_at: Date;
}
