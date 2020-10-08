import { faTimes } from '@fortawesome/free-solid-svg-icons/faTimes';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Draggable } from 'react-beautiful-dnd';
import { Application } from '../models/application.model';

export interface JobApplicationCardProps {
  index: number;
  jobApplication: Application;
  onJobApplicationRemoveClicked: (application: Application) => void;
}

export function JobApplicationCard(props: JobApplicationCardProps) {
  const { jobApplication, index, onJobApplicationRemoveClicked } = props;

  const renderJobApplication = (application: Application) => {
    const { jobPost } = application;
    return (
      <div>
        <h5>{jobPost.companyName}</h5>
        <p className='font-weight-normal'>{jobPost.title}</p>
        <p className='font-weight-light'>{jobPost.location}</p>

        <FontAwesomeIcon
          icon={faTimes}
          onClick={() => onJobApplicationRemoveClicked(application)}></FontAwesomeIcon>
      </div>
    );
  };

  return (
    <Draggable draggableId={jobApplication.jobPost.platformJobKey} index={index}>
      {(draggableProvided, draggableSnapshot) => (
        <div
          ref={draggableProvided.innerRef}
          {...draggableProvided.draggableProps}
          {...draggableProvided.dragHandleProps}
          style={{
            minHeight: '50px',
            userSelect: 'none',
            padding: 8,
            margin: '0 0 8px 0',
            color: 'black',
            backgroundColor: draggableSnapshot.isDragging ? '#ebecf0' : '#fff',
            ...draggableProvided.draggableProps.style,
          }}>
          {renderJobApplication(jobApplication)}
        </div>
      )}
    </Draggable>
  );
}
