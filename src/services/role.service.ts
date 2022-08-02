import RoleRepository from '../repositories/role.repository';
import { RoleType } from '../commons/types/role.type';
import { RoleEntity } from '../entity/role.entity';

/**
 * RoleService class.
 */
export default class RoleService {
  /**
   * @constructor
   */
  constructor(
    /**
     * RoleRepository Dependency Injection.
     *
     * @access private
     * @type RoleRepository
     */
    private roleRepository: RoleRepository,
  ) {}

  /**
   * @function Find one role by name or create new role.
   * @access public
   * @param name:RoleType
   * @return Promise<RoleEntity>
   */
  public async findOneByNameOrCreate(name: RoleType): Promise<RoleEntity> {
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
