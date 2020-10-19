import { ApiConfig, OperationMode } from 'api-lib/dist/config';
import { JobApplicationReorderRequest } from 'api-lib/dist/dto/job-application.dto';
import { JobApplicationService } from 'api-lib/dist/services/job-application.service';
import React, { useContext, useEffect, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { connect } from 'socket.io-client';
import { StatusName } from '../../constants/status-name.enum';
import { AuthContext } from '../../shared/context/auth.context';
import { ApplicationStatusColumn } from './components/ApplicationStatusColumn';
import { StatusColumns } from './models/application-status-columns.mode';
import { ApplicationStatus } from './models/application-status.model';
import { Application } from './models/application.model';
import { ApplicationCreatedEvent } from './models/websocket/created-event.model';
import { JobApplicationHelper, reorderCards, reorderColumns } from './utils';

const env = process.env.NODE_ENV;
console.log('ENV', env);
ApiConfig.setOperationMode(env === 'development' ? OperationMode.DEV : OperationMode.PROD);

const applicationHelper = new JobApplicationHelper();
const applicationService = new JobApplicationService();

function JobApplicationManagement(props: any) {
  const [statusColumns, setStatusColumns] = useState<StatusColumns>();
  const [updatedStatus, setUpdatedStatus] = useState<ApplicationStatus>();
  const [updatedApplication, setUpdatedApplication] = useState<Application>();
  const [createdEvent, setCreatedEvent] = useState<ApplicationCreatedEvent>();
  const [removedApplicationId, setRemovedApplicationId] = useState<string>();
  const { apiAccessToken } = useContext(AuthContext);

  useEffect(() => {
    if (!apiAccessToken) {
      return;
    }
    // Cannot put socket here otherwise it will reconnect when statusColumn change
    const socket = connect('wss://api.jobs-tracker.localhost', {
      query: {
        authorization: apiAccessToken,
      },
    });

    socket.on('connection', (data: any) => console.log('connected', data));
    socket.on('exception', (data: any) => console.log('Exception in Socket', data));
    socket.on('StatusChanged', (data: any) => console.log('data', data));
    socket.on('Reordered', (data: any) => console.log('data', data));
    socket.on('Created', (data: ApplicationCreatedEvent) => setCreatedEvent(data));
    socket.on('Archived', (data: any) => console.log('data', data));
  }, [apiAccessToken, setCreatedEvent]);

  useEffect(() => {
    console.log('data:', createdEvent);
    if (!createdEvent) return;
    if (!statusColumns) return;

    const { statusId } = createdEvent.payload;

    let updatedColumn = { ...statusColumns[statusId] };
    const updatedApplications = [...updatedColumn.applications];
    updatedApplications.push({ ...createdEvent.payload, id: createdEvent.payload.applicationId });
    updatedColumn = { ...updatedColumn, applications: updatedApplications };
    const updatedStatusColumns = { ...statusColumns, [statusId]: updatedColumn };
    setStatusColumns(updatedStatusColumns);
  }, [createdEvent]);

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

    setStatusColumns({ ...statusColumns, [statusId]: updatedStatusColumn });
    setRemovedApplicationId(removedApplication.id);
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
      const { id, statusId, position } = updatedApplication;

      const payload: JobApplicationReorderRequest = {
        statusId,
        position,
      };
      const data = await applicationService.reorder(id, payload);
    };
    update();
  }, [updatedApplication]);

  useEffect(() => {
    if (!removedApplicationId) {
      return;
    }

    const archiveApplication = async () => {
      const data = await applicationService.archive(removedApplicationId, true);
    };
    archiveApplication();
  }, [removedApplicationId]);

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
