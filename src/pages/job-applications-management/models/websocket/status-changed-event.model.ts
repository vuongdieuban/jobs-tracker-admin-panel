import { JobPost } from 'api-lib/dist/dto/job-post.dto';
import { ApplicationEventName } from '../../constants/application-event-name.enum';
import { BaseEventPayload } from './base-event-payload.model';

export interface StatusChangedEventPayload extends BaseEventPayload {
  previousStatusId: string;
  updatedStatusId: string;
  position: number;
  jobPost: JobPost;
}

export interface ApplicationStatusChangedEvent {
  event: ApplicationEventName.STATUS_CHANGED;
  payload: StatusChangedEventPayload;
}
