import { Knex } from 'knex';
import RepositoryInterface from '../commons/contracts/repository.interface';

/**
 * Abstract BaseRepository class.
 */
export default abstract class BaseRepository<Entity> implements RepositoryInterface<Entity> {
  /**
   * Knex.js query builder.
   *
   * @access protected
   * @type Knex.QueryBuilder
   */
  protected qb: Knex.QueryBuilder;

  /**
   * @constructor
   */
  protected constructor(
    /**
     * Knex.js connection.
     *
     * @access protected readonly
     * @type Knex
     */
    protected readonly knex: Knex,

    /**
     * Table name in the database.
     *
     * @access protected readonly
     * @type string
     */
    protected readonly tableName: string,
  ) {
    this.qb = this.knex<Entity>(this.tableName);
  }

  /**
   * @function Find all entities in the database.
   * @access public
   * @return Promise<Entity[]>
   */
  public async findAll(): Promise<Entity[]> {
    return this.qb.select();
  }

  /**
   * @function Find one entity by id or by data Entity object.
   * @access public
   * @param id:number|Partial<Entity>
   * @return Promise<Entity>
   */
  public async findOne(id: number | Partial<Entity>): Promise<Entity> {
    return this.qb.where(id).first();
  }

  /**
   * @function Create new entity.
   * @access public
   * @param item:Omit<Entity,'id'>
   * @return Promise<Entity>
   */
  public async create(item: Omit<Entity, 'id'>): Promise<Entity> {
    const [output] = await this.qb.insert<Entity>(item).returning('*');

    return output as Promise<Entity>;
  }

  /**
   * @function Update exist entity.
   * @access public
   * @param id:number
   * @param updateEntityDto:Partial<Entity>
   * @return Promise<Entity>
   */
  public async update(id: number, updateEntityDto: Partial<Entity>): Promise<Entity> {
    const [output] = await this.qb.where({ id }).update(updateEntityDto).returning('*');

    return output as Promise<Entity>;
  }

  /**
   * @function Delete one entity by id or by data Entity object.
   * @access public
   * @param id:number|Partial<Entity>
   * @return Promise<boolean>
   */
  public async delete(id: number | Partial<Entity>): Promise<boolean> {
    return this.qb.where(id).del();
  }
}
