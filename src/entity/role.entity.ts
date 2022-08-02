import { RoleType } from '../commons/types/role.type';

/**
 * Role Entity.
 */
export interface RoleEntity {
  id: number;
  name: RoleType;
  description: string;
  created_at: Date;
  updated_at: Date;
}
