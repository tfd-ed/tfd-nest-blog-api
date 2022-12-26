import { SetMetadata } from '@nestjs/common';

export const IGNORE_CACHE_KEY = 'ignoreCaching';
export const NoCache = () => SetMetadata(IGNORE_CACHE_KEY, true);
