import {
  EntitySubscriberInterface,
  EventSubscriber,
  InsertEvent,
} from 'typeorm';
import { paramCase } from 'change-case';
import { Logger } from '@nestjs/common';
import { CourseEntity } from '../entity/course.entity';

@EventSubscriber()
export class CourseSubscriber
  implements EntitySubscriberInterface<CourseEntity>
{
  private readonly logger = new Logger(CourseSubscriber.name);
  /**
   * Indicates that this subscriber only listen to ConfessionRoom events.
   */
  listenTo() {
    return CourseEntity;
  }
  /**
   * Called after course insertion.
   */
  async afterInsert(event: InsertEvent<CourseEntity>) {
    const supposed_url = paramCase(event.entity.title);
    event.manager
      .update(CourseEntity, event.entity.id, {
        titleURL: supposed_url,
      })
      .then((r) => {
        this.logger.log('Course URL generated: ' + event.entity.id);
      });
  }
}
