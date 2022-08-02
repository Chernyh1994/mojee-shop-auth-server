/**
 * CreateTokenDto class.
 */
export class CreateTokenDto {
  refresh_token: string;
  user_id: number;
  expires_in: Date;
}
