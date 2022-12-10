import { Request } from 'express';
import { UserEntity } from '../../user/entity/user.entity';

interface RequestWithUser extends Request {
  user: UserEntity;
}

export default RequestWithUser;
