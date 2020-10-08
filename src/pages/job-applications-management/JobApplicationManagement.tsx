import { ApiConfig, OperationMode } from 'api-lib/dist/config';
import { JobApplicationReorderRequest } from 'api-lib/dist/dto/job-application.dto';
import { JobApplicationService } from 'api-lib/dist/services/job-application.service';
import React, { useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { StatusName } from '../../constants/status-name.enum';
import { ApplicationStatusColumn } from './components/ApplicationStatusColumn';
import { StatusColumns } from './models/application-status-columns.mode';
import { ApplicationStatus } from './models/application-status.model';
import { Application } from './models/application.model';
import { JobApplicationHelper, reorderCards, reorderColumns } from './utils';

const env = process.env.NODE_ENV;
ApiConfig.setOperationMode(env === 'development' ? OperationMode.DEV : OperationMode.PROD);

const applicationHelper = new JobApplicationHelper();
const applicationService = new JobApplicationService();

function JobApplicationManagement(props: any) {
  const [statusColumns, setStatusColumns] = useState<StatusColumns>();
  const [updatedStatus, setUpdatedStatus] = useState<ApplicationStatus>();
  const [updatedApplication, setUpdatedApplication] = useState<Application>();

  useEffect(() => {
    const fetchApplications = async () => {
      const columns: StatusColumns = await applicationHelper.generateDisplayStatusColumns();
      setStatusColumns(columns);
    };

    fetchApplications();
  }, []);

  const handleJobApplicationRemoveClicked = (removedApplication: Application) => {
    if (!statusColumns) {
      return;
    }
    const { statusId } = removedApplication;
    const statusColumn = statusColumns[statusId];
    const updatedStatusColumn = { ...statusColumn };
    updatedStatusColumn.applications = updatedStatusColumn.applications.filter(
      (application) => application.id !== removedApplication.id
    );

    const archivedStatus = applicationHelper.getStatusByName(StatusName.ARCHIVED);
    setStatusColumns({ ...statusColumns, [statusId]: updatedStatusColumn });
    setUpdatedApplication({ ...removedApplication, statusId: archivedStatus.id });
  };

  const handleDragEnd = (result: DropResult, columns: StatusColumns) => {
    if (!result.destination) {
      return;
    }

    if (result.type === 'CardList') {
      const data = reorderCards(result, columns);
      if (!data) {
        return;
      }
      const [updatedColumns, updatedJobApplication] = data;
      setStatusColumns(updatedColumns);
      setUpdatedApplication(updatedJobApplication);
    } else {
      const data = reorderColumns(result, columns);
      if (!data) {
        return;
      }
      const [updatedColumns, updatedJobStatus] = data;
      setStatusColumns(updatedColumns);
      setUpdatedStatus(updatedJobStatus);
    }
  };

  useEffect(() => {
    // TODO: Probably don't need to persist to db since there will be only 2 columns in popup extension
    // persist their order to chrome local storage in background script
    // will call backend to update column in admin panel
  }, [updatedStatus]);

  useEffect(() => {
    // TODO: this is optimistic update, we set the state and render the view before call backend,
    // If error occur, need to revert and set state back to the previous state.
    if (!updatedApplication) {
      return;
    }
    const update = async () => {
      const { id, statusId } = updatedApplication;
      const archivedStatus = applicationHelper.getStatusByName(StatusName.ARCHIVED);
      const position = statusId === archivedStatus.id ? undefined : updatedApplication.position;

      const payload: JobApplicationReorderRequest = {
        statusId,
        position,
      };
      const data = await applicationService.reorder(id, payload);
    };
    update();
  }, [updatedApplication]);

  const renderColumns = (columns: StatusColumns) => {
    // When column have their display position, sort them based on their position first before render
    const displayColumns = Object.values(columns).sort((a, b) => a.status.position - b.status.position);
    return (
      <Droppable droppableId='column-drop' direction='horizontal' type='StatusColumn'>
        {(droppableProvided, droppableSnapshot) => (
          <div
            className='row'
            {...droppableProvided.droppableProps}
            ref={droppableProvided.innerRef}
            style={{
              background: '#ebecf0',
              height: '100%',
              width: '100%',
              margin: 0,
            }}>
            {displayColumns.map((col, index) => (
              <ApplicationStatusColumn
                key={col.status.id}
                index={index}
                status={col.status}
                applications={col.applications}
                onJobApplicationRemoveClicked={handleJobApplicationRemoveClicked}
              />
            ))}
            {droppableProvided.placeholder}
          </div>
        )}
      </Droppable>
    );
  };

  return (
    <React.Fragment>
      {statusColumns && (
        <DragDropContext onDragEnd={(result) => handleDragEnd(result, statusColumns)}>
          {renderColumns(statusColumns)}
        </DragDropContext>
      )}
    </React.Fragment>
  );
}

export { JobApplicationManagement };
