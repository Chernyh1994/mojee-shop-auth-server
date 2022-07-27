export interface UserEntity {
  id: number;
  firstName: string;
  email: string;
  password: string;
  age: number;
  role_id: number;
  token_id: number;
  isDeleted: boolean;
  created_at: Date;
  updated_at: Date;
}
