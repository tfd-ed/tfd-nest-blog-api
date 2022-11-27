import { Ctx, On, Update } from 'nestjs-telegraf';
import { Public } from '../../common/decorator/public.decorator';
import { TelegrafContextInterface } from '../../common/context/telegraf-context.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AbaTransferEntity } from '../../purchase/entity/aba-transfer.entity';
import { Logger, NotAcceptableException, UseFilters } from '@nestjs/common';
import { TelegrafFilter } from '../../common/filter/telegraf.filter';

@Update()
@UseFilters(TelegrafFilter)
export class CourseBot {
  constructor(
    @InjectRepository(AbaTransferEntity)
    private readonly abaTransfer: Repository<AbaTransferEntity>,
  ) {}
  private readonly logger = new Logger(CourseBot.name);

  @Public()
  @On('text')
  async hears(@Ctx() ctx: TelegrafContextInterface) {
    this.logger.log('Bot message received by ' + ctx.message.from.username);
    if (ctx.message.from.username === 'PayWayByABA_bot') {
      if (ctx.message.text.includes('USD')) {
        const price = ctx.message.text.split('USD')[0].trim();
        const transaction = ctx.message.text.split('purchase')[1].trim();
        try {
          await this.abaTransfer.save(
            this.abaTransfer.create({
              price: parseFloat(price),
              transaction: transaction,
            }),
          );
        } catch (e) {
          return new NotAcceptableException(e);
        }
        this.logger.log('ABA with transaction: ' + transaction + ' saved! ');
      }
    }
  }
}
