import { DragEvent, useState } from 'react';
import Swal from 'sweetalert2';
import { useTaskStore } from '../stores';
import { TaskStatus } from '../interfaces';

interface Options {
  status: TaskStatus;
}

export const useTask = ({ status }: Options) => {
  const isDragging = useTaskStore((state) => !!state.draggingTaskId);
  // const draggingTaskId = useTaskStore((state) => state.draggingTaskId);
  // const changeProgress = useTaskStore((state) => state.changeTaskStatus);
  const onTaskDrop = useTaskStore((state) => state.onTaskDrop);
  const addTask = useTaskStore((state) => state.addTask);

  const [onDragOver, setOnDragOver] = useState<boolean>(false);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setOnDragOver(true);
  };

  const handleDragLeave = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setOnDragOver(false);
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setOnDragOver(false);
    onTaskDrop(status);
    // changeProgress(draggingTaskId!, value);
  };

  const handleAddTask = async () => {
    const { isConfirmed, value } = await Swal.fire({
      title: 'Nueva Tarea',
      input: 'text',
      inputLabel: 'Nombre de la tarea',
      inputPlaceholder: 'Ingrese el nombre de la tarea',
      showCancelButton: true,
      inputValidator: (value) => {
        if (!value) {
          return 'Debe ingresar un nombre para la tarea';
        }
      },
    });

    if (!isConfirmed) return;
    addTask(value, status);
  };

  return {
    isDragging,
    onDragOver,
    handleAddTask,
    handleDragLeave,
    handleDragOver,
    handleDrop,
  };
};
