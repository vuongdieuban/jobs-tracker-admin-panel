import { JobPost } from 'api-lib/dist/dto/job-post.dto';
import { ApplicationEventName } from '../../constants/application-event-name.enum';
import { BaseEventPayload } from './base-event-payload.model';

export interface ReorderedEventPayload extends BaseEventPayload {
  statusId: string;
  position: number;
  jobPost: JobPost;
}

export interface ApplicationReorderedEvent {
  event: ApplicationEventName.REORDERED;
  payload: ReorderedEventPayload;
}
