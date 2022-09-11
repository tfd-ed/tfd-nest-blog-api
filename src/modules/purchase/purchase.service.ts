import { TypeOrmCrudService } from '@nestjsx/crud-typeorm';
import { PurchaseEntity } from './entity/purchase.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PurchaseEnum } from '../common/enum/purchase.enum';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { UserEntity } from '../user/entity/user.entity';
import { CourseEntity } from '../course/entity/course.entity';
import { ConfigService } from '@nestjs/config';

export class PurchaseService extends TypeOrmCrudService<PurchaseEntity> {
  constructor(
    @InjectRepository(PurchaseEntity)
    private readonly purchaseRepository: Repository<PurchaseEntity>,
    @InjectRepository(CourseEntity)
    private readonly courseRepository: Repository<CourseEntity>,
    private readonly configService: ConfigService,
    private eventEmitter: EventEmitter2,
  ) {
    super(purchaseRepository);
  }
  async approvePurchase(purchaseId: string) {
    await this.purchaseRepository.update(
      {
        id: purchaseId,
      },
      {
        status: PurchaseEnum.VERIFIED,
      },
    );
    const purchase = await this.purchaseRepository.findOne(
      { id: purchaseId },
      { relations: ['byUser', 'course'] },
    );

    const user: unknown = <unknown>purchase.byUser;
    const byUser: UserEntity = <UserEntity>user;

    const course: unknown = <unknown>purchase.course;
    const courseF: CourseEntity = <CourseEntity>course;

    const course_url =
      this.configService.get('FRONTEND_URL') + '/course/' + courseF.id;

    this.eventEmitter.emit('admin.approved', {
      fullName: byUser.firstname + ' ' + byUser.lastname,
      link: course_url,
      email: byUser.email,
      price: purchase.price,
      courseTitle: courseF.title,
      timestamp: purchase.createdDate,
    });
  }
}
