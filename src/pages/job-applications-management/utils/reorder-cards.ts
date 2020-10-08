import { DropResult } from 'react-beautiful-dnd';
import { StatusColumns } from '../models/application-status-columns.mode';
import { Application } from '../models/application.model';

export function reorderCards(
  dropResult: DropResult,
  columns: StatusColumns
): [StatusColumns, Application] | undefined {
  if (!dropResult.destination) {
    return undefined;
  }

  const { source, destination } = dropResult;

  // droppableId is statusId
  if (source.droppableId !== destination.droppableId) {
    const sourceColumn = columns[source.droppableId];
    const destColumn = columns[destination.droppableId];
    const sourceItems = [...sourceColumn.applications];
    const destItems = [...destColumn.applications];

    // remove from source and add to destination (source and destination are two diff columns)
    const [removedItem] = sourceItems.splice(source.index, 1); // remove from source
    const updatedItem: Application = {
      ...removedItem,
      statusId: destination.droppableId,
      position: destination.index,
    };
    destItems.splice(destination.index, 0, updatedItem); // add updated into desitnation

    const updatedColumns: StatusColumns = {
      ...columns,
      [source.droppableId]: { ...sourceColumn, applications: sourceItems },
      [destination.droppableId]: { ...destColumn, applications: destItems },
    };
    return [updatedColumns, updatedItem];
  } else {
    // re-order items in the same column (source and destination are same columns)
    const sourceColumn = columns[source.droppableId];
    const sourceItems = [...sourceColumn.applications];

    const [removedItem] = sourceItems.splice(source.index, 1);
    const updatedItem: Application = { ...removedItem, position: destination.index };
    sourceItems.splice(destination.index, 0, updatedItem);

    const updatedColumns: StatusColumns = {
      ...columns,
      [source.droppableId]: { ...sourceColumn, applications: sourceItems },
    };
    return [updatedColumns, updatedItem];
  }
}
