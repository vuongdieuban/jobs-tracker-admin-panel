import { DropResult } from 'react-beautiful-dnd';
import { StatusColumn, StatusColumns } from '../models/application-status-columns.mode';
import { ApplicationStatus } from '../models/application-status.model';

function updateColumns(
  columns: StatusColumns,
  columnsToBeUpdated: StatusColumn[],
  desiredColumnId: string,
  destPosition: number
): [StatusColumns, ApplicationStatus] {
  const updatedColumns = { ...columns };
  const desiredColumn = columns[desiredColumnId];
  const updatedDesiredColumn = { ...desiredColumn };

  const updatedStatus: ApplicationStatus = { ...updatedDesiredColumn.status, position: destPosition };
  updatedDesiredColumn.status = updatedStatus;
  columnsToBeUpdated.push(updatedDesiredColumn);

  columnsToBeUpdated.forEach((col) => {
    updatedColumns[col.status.id] = col;
  });

  return [updatedColumns, updatedStatus];
}

// TODO: Maybe it is better to model columns as Array instead of Dictionary
function columnMovesLeft(
  columns: StatusColumns,
  desiredColumnId: string,
  sourcePosition: number,
  destPosition: number
): [StatusColumns, ApplicationStatus] {
  const columnsToBeUpdated = Object.values(columns)
    .filter(({ status }) => status.position >= destPosition && status.position < sourcePosition)
    .map((item) => ({ ...item, status: { ...item.status, position: item.status.position + 1 } }));

  return updateColumns(columns, columnsToBeUpdated, desiredColumnId, destPosition);
}

function columnMovesRight(
  columns: StatusColumns,
  desiredColumnId: string,
  sourcePosition: number,
  destPosition: number
): [StatusColumns, ApplicationStatus] {
  const columnsToBeUpdated = Object.values(columns)
    .filter(({ status }) => status.position > sourcePosition && status.position <= destPosition)
    .map((item) => ({ ...item, status: { ...item.status, position: item.status.position - 1 } }));

  return updateColumns(columns, columnsToBeUpdated, desiredColumnId, destPosition);
}

export function reorderColumns(
  dropResult: DropResult,
  columns: StatusColumns
): [StatusColumns, ApplicationStatus] | undefined {
  if (!dropResult.destination) {
    return undefined;
  }

  const { source, destination, draggableId } = dropResult;

  return destination.index > source.index
    ? columnMovesRight(columns, draggableId, source.index, destination.index)
    : columnMovesLeft(columns, draggableId, source.index, destination.index);
}
