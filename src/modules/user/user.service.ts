import {
  BadRequestException,
  Injectable,
  NotAcceptableException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from './entity/user.entity';
import { Hash } from '../../utils/Hash';
import {
  IPaginationOptions,
  paginate,
  Pagination,
} from 'nestjs-typeorm-paginate';
import { ResetPayload } from '../auth/payloads/reset.payload';
import { UpdatePayload } from './payloads/update.payload';
import { RegisterPayload } from '../auth/payloads/register.payload';
import { PurchaseEntity } from '../course/entity/purchase.entity';
import { PurchaseEnum } from '../common/enum/purchase.enum';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(PurchaseEntity)
    private readonly purchaseRepository: Repository<PurchaseEntity>,
  ) {}

  async get(id: string) {
    return this.userRepository.findOne(id);
  }

  async getByUsername(username: string) {
    return await this.userRepository.findOne({ username: username });
  }

  async update(id: string, updatePayload: UpdatePayload): Promise<any> {
    const admin = await this.userRepository.findOne(id);
    const updated = Object.assign(admin, updatePayload);
    delete updated.password;
    try {
      return await this.userRepository.save(updated);
    } catch (e) {
      throw new NotAcceptableException('Username or Email already exists!');
    }
  }

  async getAll(options: IPaginationOptions): Promise<Pagination<UserEntity>> {
    const queryBuilder = await this.userRepository.createQueryBuilder('a');
    queryBuilder.orderBy('a.updatedDate', 'DESC');
    return paginate<UserEntity>(queryBuilder, options);
  }

  async getCourse(
    id: string,
    options: IPaginationOptions,
  ): Promise<Pagination<PurchaseEntity>> {
    const queryBuilder = this.purchaseRepository.createQueryBuilder('purchase');
    queryBuilder.andWhere('purchase.byUserId =:id', {
      id: id,
    });
    queryBuilder.andWhere('purchase.status =:status', {
      status: PurchaseEnum.VERIFIED,
    });
    queryBuilder.leftJoinAndSelect('purchase.courseId', 'purchasedCourses');
    return paginate<PurchaseEntity>(queryBuilder, options);
  }

  async changPassword(payload: ResetPayload): Promise<any> {
    const user = await this.getByUsername(payload.username);
    if (!user || !Hash.compare(payload.currentPassword, user.password)) {
      throw new UnauthorizedException('Invalid credentials!');
    }
    await this.userRepository
      .createQueryBuilder('users')
      .update(UserEntity)
      .set({ password: payload.newPassword })
      .where('username =:username', { username: payload.username })
      .execute();
    return user;
  }

  async create(payload: RegisterPayload) {
    const user = await this.getByUsername(payload.username);
    if (user) {
      throw new NotAcceptableException(
        'Admin with provided username already created.',
      );
    }
    return await this.userRepository.save(this.userRepository.create(payload));
  }

  async delete(id: string): Promise<any> {
    const user = await this.userRepository.findOne(id);
    const deleted = await this.userRepository.delete(id);
    if (deleted.affected === 1) {
      return { message: `Deleted ${user.username} from records` };
    } else {
      throw new BadRequestException(
        `Failed to delete a profile by the name of ${user.username}.`,
      );
    }
  }
}
