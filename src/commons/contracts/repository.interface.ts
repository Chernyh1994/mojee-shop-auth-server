export default interface RepositoryInterface<Entity> {
  findAll(): Promise<Entity[]>;

  findOne(id: number | Partial<Entity>): Promise<Entity>;

  create(createEntityDto: Omit<Entity, 'id'>): Promise<Entity>;

  update(id: number, updateEntityDto: Partial<Entity>): Promise<Entity>;

  delete(id: number | Partial<Entity>): Promise<boolean>;
}
