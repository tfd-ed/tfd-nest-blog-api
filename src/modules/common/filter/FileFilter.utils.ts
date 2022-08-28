import { NotAcceptableException } from '@nestjs/common';

export const fileFilterUtils = (req, file, callback) => {
  if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG)$/)) {
    return callback(
      new NotAcceptableException('Only image file is allowed!'),
      false,
    );
  }
  callback(null, true);
};
