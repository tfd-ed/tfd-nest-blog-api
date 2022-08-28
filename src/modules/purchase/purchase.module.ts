import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { PurchaseService } from './purchase.service';
import { PurchaseController } from './purchase.controller';
import { PurchaseEntity } from './entity/purchase.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([PurchaseEntity]),
    PassportModule.register({ defaultStrategy: 'local' }),
  ],
  exports: [PurchaseService],
  controllers: [PurchaseController],
  providers: [PurchaseService],
})
export class PurchaseModule {}
