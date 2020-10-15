import { JobPost } from 'api-lib/dist/dto/job-post.dto';
import { ApplicationEventName } from '../../constants/application-event-name.enum';
import { BaseEventPayload } from './base-event-payload.model';

export interface CreatedEventPayload extends BaseEventPayload {
  statusId: string;
  jobPost: JobPost;
  position: number;
}

export interface ApplicationCreatedEvent {
  event: ApplicationEventName.CREATED;
  payload: CreatedEventPayload;
}
