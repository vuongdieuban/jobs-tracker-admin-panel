import { ApplicationStatus } from './application-status.model';
import { Application } from './application.model';

export interface StatusColumn {
  status: ApplicationStatus;
  applications: Application[];
}

export interface StatusColumns {
  [statusId: string]: StatusColumn;
}
