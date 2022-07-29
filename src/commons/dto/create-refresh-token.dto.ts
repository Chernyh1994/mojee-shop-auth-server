export class CreateRefreshTokenDto {
  refresh_token: string;
  user_id: number;
  expires_in: Date;
  readonly created_at: Date;
  readonly updated_at: Date;
}
