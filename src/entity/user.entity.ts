/**
 * User Entity.
 */
export interface UserEntity {
  id: number;
  email: string;
  password: string;
  is_verified?: boolean;
  is_deleted?: boolean;
  profile_id?: number;
  role_id?: number;
  created_at?: Date;
  updated_at?: Date;
}
