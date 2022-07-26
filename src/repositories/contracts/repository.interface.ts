export default interface RepositoryInterface<Entity> {
  findAll(): Promise<Entity[]>;

  // findOne(id: string): Promise<Entity>;
  //
  // create(dto: DTO): Promise<Entity>;
  //
  // update(id: string, dto: DTO): Promise<Entity>;
  //
  // delete(id: string): Promise<boolean>;
}
