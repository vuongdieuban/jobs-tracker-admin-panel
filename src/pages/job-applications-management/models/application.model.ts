import { JobPost } from 'api-lib/dist/dto/job-post.dto';

export interface Application {
  id: string;
  position: number;
  statusId: string;
  userId: string;
  jobPost: JobPost;
}
