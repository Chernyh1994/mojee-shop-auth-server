import { UserRoleType } from '../commons/types/user-role.type';

export interface RoleEntity {
  id: number;
  name: UserRoleType;
  description: string;
  created_at: Date;
  updated_at: Date;
}
