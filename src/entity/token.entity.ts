/**
 * Token Entity.
 */
export interface TokenEntity {
  id: number;
  refresh_token: string;
  user_id: number;
  expires_in: Date;
  created_at?: Date;
  updated_at?: Date;
}
