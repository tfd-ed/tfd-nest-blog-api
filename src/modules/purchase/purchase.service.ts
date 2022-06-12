import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PurchaseEntity } from '../course/entity/purchase.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

export class PurchaseService extends TypeOrmCrudService<PurchaseEntity> {
  constructor(
    @InjectRepository(PurchaseEntity)
    private readonly purchaseRepository: Repository<PurchaseEntity>,
  ) {
    super(purchaseRepository);
  }
}
