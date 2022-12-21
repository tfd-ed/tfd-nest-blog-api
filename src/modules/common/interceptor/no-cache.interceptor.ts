import { CacheInterceptor, ExecutionContext } from '@nestjs/common';
import { IGNORE_CACHE_KEY } from '../decorator/no-cache.decorator';

export class NoCacheInterceptor extends CacheInterceptor {
  // constructor(
  //   @Inject(CACHE_MANAGER) public cacheManager: Cache,
  //   public reflector: Reflector,
  // ) {
  //   super(cacheManager, reflector);
  // }
  protected isRequestCacheable(context: ExecutionContext): boolean {
    const http = context.switchToHttp();
    const request = http.getRequest();

    const ignoreCaching: boolean = this.reflector.get(
      IGNORE_CACHE_KEY,
      context.getHandler(),
    );
    // const ignoreCaching = this.reflector.getAllAndOverride<boolean>(
    //   IGNORE_CACHE_KEY,
    //   [context.getHandler(), context.getClass()],
    // );
    // console.log(request.method);
    // console.log(ignoreCaching);
    // console.log(request.route.path);
    if (ignoreCaching) {
      return false;
    }
    // if (request.method === 'GET') {
    //   return true;
    // }
    return request.method === 'GET';

    // console.log(!ignoreCaching || request.method === 'GET');
    //
    // return !ignoreCaching || request.method === 'GET';
  }
}
