import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { ApplicationStatus } from '../models/application-status.model';
import { Application } from '../models/application.model';
import { JobApplicationCard } from './JobApplicationCard';

export interface ApplicationStatusColumnProps {
  index: number;
  status: ApplicationStatus;
  applications: Application[];
  onJobApplicationRemoveClicked: (application: Application) => void;
}

export function ApplicationStatusColumn(props: ApplicationStatusColumnProps) {
  const { applications, status, onJobApplicationRemoveClicked, index } = props;
  return (
    <Draggable draggableId={status.id} index={index} key={status.id}>
      {(draggableProvided, draggableSnapshot) => (
        <div
          className='col'
          ref={draggableProvided.innerRef}
          {...draggableProvided.draggableProps}
          style={{
            userSelect: 'none',
            margin: 10,
            backgroundColor: draggableSnapshot.isDragging ? '#b4f5cb' : '#fff',
            ...draggableProvided.draggableProps.style,
          }}>
          <div className='d-flex flex-column align-items-center'>
            <h2 className='mb-0 ml-2' {...draggableProvided.dragHandleProps}>
              {status.name}
            </h2>
          </div>
          <div style={{ margin: 8, maxHeight: '80vh', overflowY: 'scroll' }}>
            <Droppable droppableId={status.id} type='CardList'>
              {(droppableProvided, droppableSnapshot) => (
                <div
                  {...droppableProvided.droppableProps}
                  ref={droppableProvided.innerRef}
                  style={{
                    background: droppableSnapshot.isDraggingOver ? '#adadad' : '#ebecf0',
                    padding: 4,
                    minHeight: '40vh',
                  }}>
                  {applications.map((application, i) => (
                    <JobApplicationCard
                      key={application.id} // important, don't use index for key
                      jobApplication={application}
                      index={i}
                      onJobApplicationRemoveClicked={onJobApplicationRemoveClicked}
                    />
                  ))}
                  {droppableProvided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      )}
    </Draggable>
  );
}
