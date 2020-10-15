import { ApplicationCreatedEvent } from './created-event.model';
import { ApplicationReorderedEvent } from './reordered-event.model';
import { ApplicationStatusChangedEvent } from './status-changed-event.model';

export type ApplicationEvent =
  | ApplicationReorderedEvent
  | ApplicationStatusChangedEvent
  | ApplicationCreatedEvent;
