import { JobApplicationStatus as StatusBackendModel } from 'api-lib/dist/dto/job-application-status.dto';
import { JobApplication as ApplicationBackendModel } from 'api-lib/dist/dto/job-application.dto';
import { JobApplicationStatusService } from 'api-lib/dist/services/job-application-status.service';
import { JobApplicationService } from 'api-lib/dist/services/job-application.service';
import { StatusName } from '../../../constants/status-name.enum';
import { StatusColumn, StatusColumns } from '../models/application-status-columns.mode';
import { ApplicationStatus } from '../models/application-status.model';
import { Application } from '../models/application.model';

export class JobApplicationHelper {
  private readonly applicationService: JobApplicationService;
  private readonly statusService: JobApplicationStatusService;
  private applications: ApplicationBackendModel[] = [];
  private status: StatusBackendModel[] = [];

  constructor() {
    this.applicationService = new JobApplicationService();
    this.statusService = new JobApplicationStatusService();
  }

  public async generateDisplayStatusColumns(): Promise<StatusColumns> {
    const [supportedStatus, applications] = await Promise.all([
      this.statusService.findAll(),
      this.applicationService.findAll(),
    ]);
    this.applications = applications;
    this.status = supportedStatus;

    const appliedApplications = this.getAppliedApplications();
    const wishListApplications = this.getWishListApplications();

    const appliedStatus = this.getStatusByName(StatusName.APPLIED);
    const wishListStatus = this.getStatusByName(StatusName.WISH_LIST);

    // Since we group everything that is not wishlist and archived into applied, we just manually asign the position
    // In Admin Panel, there will be multi columns,
    // their display position is coming from backend, we update backend when column is reordered by customer
    const appliedColumn: StatusColumn = {
      status: { ...appliedStatus, position: 0 },
      applications: appliedApplications,
    };

    const wishListColumn: StatusColumn = {
      status: { ...wishListStatus, position: 1 },
      applications: wishListApplications,
    };

    return {
      [appliedStatus.id]: appliedColumn,
      [wishListStatus.id]: wishListColumn,
    };
  }

  public getStatusByName(name: StatusName): ApplicationStatus {
    const data = this.status.map((s) => this.mapToViewModel(s)).find((s) => s.name === name);
    if (!data) {
      throw new Error(`Cannot find status with name ${name}`);
    }
    return data;
  }

  private getAppliedApplications(): Application[] {
    // Applied applications should be all except status wish list and archived
    return this.applications
      .filter((item) => item.status.name !== StatusName.WISH_LIST && item.status.name !== StatusName.ARCHIVED)
      .sort((a, b) => a.position - b.position)
      .map((application) => this.mapApplicationToViewModel(application));
  }

  private getWishListApplications(): Application[] {
    return this.applications
      .filter((item) => item.status.name === StatusName.WISH_LIST)
      .sort((a, b) => a.position - b.position)
      .map((application) => this.mapApplicationToViewModel(application));
  }

  private mapApplicationToViewModel(application: ApplicationBackendModel): Application {
    return {
      id: application.id,
      position: application.position,
      statusId: application.status.id,
      userId: application.user.id,
      jobPost: application.jobPost,
    };
  }

  private mapToViewModel(status: StatusBackendModel): ApplicationStatus {
    return {
      id: status.id,
      name: status.name,
      position: 0,
    };
  }
}
