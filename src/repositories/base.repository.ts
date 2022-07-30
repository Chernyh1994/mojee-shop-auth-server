import { Knex } from 'knex';
import RepositoryInterface from '../commons/contracts/repository.interface';

export default abstract class BaseRepository<Entity>
  implements RepositoryInterface<Entity>
{
  protected qb: Knex.QueryBuilder;

  protected constructor(
    protected readonly knex: Knex,
    protected readonly tableName: string,
  ) {
    this.qb = this.knex<Entity>(this.tableName);
  }

  public findAll(): Promise<Entity[]> {
    return this.qb.select();
  }

  public findOne(id: number | Partial<Entity>): Promise<Entity> {
    return this.qb.where(id).first();
  }

  async create(item: Omit<Entity, 'id'>): Promise<Entity> {
    const [output] = await this.qb.insert<Entity>(item).returning('*');

    return output as Promise<Entity>;
  }

  public async update(
    id: number,
    updateEntityDto: Partial<Entity>,
  ): Promise<Entity> {
    const [output] = await this.qb
      .where({ id })
      .update(updateEntityDto)
      .returning('*');

    return output as Promise<Entity>;
  }

  public delete(id: number | Partial<Entity>): Promise<boolean> {
    return this.qb.where(id).del();
  }
}
