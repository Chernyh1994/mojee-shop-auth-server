import RoleRepository from '../repositories/role.repository';
import { UserRoleType } from '../commons/types/user-role.type';
import { RoleEntity } from '../entity/role.entity';

export default class RoleService {
  constructor(private roleRepository: RoleRepository) {}

  public async findOneByNameOrCreate(name: UserRoleType): Promise<RoleEntity> {
    let role: RoleEntity = await this.roleRepository.findOne({ name });

    if (!role) {
      const data: any = {
        name: name,
        description: `Role's ${name}`,
      };

      role = await this.roleRepository.create(data);
    }

    return role;
  }
}
