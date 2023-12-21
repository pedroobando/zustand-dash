import { StateCreator, create } from 'zustand';
import type { Task, TaskStatus } from '../../interfaces';
import { devtools, persist } from 'zustand/middleware';
import { v4 as uuidV4 } from 'uuid';
// import { produce } from 'immer';
import { immer } from 'zustand/middleware/immer';

interface TaskState {
  draggingTaskId?: string | undefined;

  tasks: Record<string, Task>;

  getTaskCount: () => number;

  getTaskByStatus: (status: TaskStatus) => Task[];

  setDraggingTaskId: (taskId: string) => void;
  removeDraggingTaskId: () => void;
  changeTaskStatus: (taskId: string, status: TaskStatus) => void;

  onTaskDrop: (status: TaskStatus) => void;
  addTask: (title: string, status: TaskStatus) => void;
}

const storeApi: StateCreator<TaskState, [['zustand/devtools', never], ['zustand/immer', never]]> = (
  set,
  get
) => ({
  draggingTaskId: undefined,

  tasks: {
    'ABC-1': { id: 'ABC-1', title: 'Task 1', status: 'open' },
    'ABC-2': { id: 'ABC-2', title: 'Task 2', status: 'in-progress' },
    'ABC-3': { id: 'ABC-3', title: 'Task 3', status: 'open' },
    'ABC-4': { id: 'ABC-4', title: 'Task 4', status: 'done' },
  },

  getTaskByStatus: (status: TaskStatus) => {
    const tasks = get().tasks;
    return Object.values(tasks).filter((task) => task.status === status);
  },

  setDraggingTaskId: (taskId: string) => {
    set({ draggingTaskId: taskId });
  },

  removeDraggingTaskId: () => {
    set({ draggingTaskId: undefined });
  },

  changeTaskStatus: (taskId: string, status: TaskStatus) => {
    // const task = get().tasks[taskId];
    const task = { ...get().tasks[taskId] };
    task.status = status;

    //INFO: MODO ZUSTAND MIDDLEWARE IMMER
    set((state) => {
      state.tasks[taskId] = task;
    });

    //INFO: MODO TRADICIONAL
    // set((state) => ({
    //   tasks: {
    //     ...state.tasks,
    //     [taskId]: task,
    //   },
    // }));
  },

  onTaskDrop: (status: TaskStatus) => {
    const taskId = get().draggingTaskId;
    if (!taskId) return;

    get().changeTaskStatus(taskId, status);
    get().removeDraggingTaskId();
  },

  addTask: (title: string, status: TaskStatus) => {
    const newTask: Task = { id: uuidV4(), title, status };

    //INFO: Con el middleware de immer
    set((state) => {
      state.tasks[newTask.id] = newTask;
    });

    //INFO: Esto es con el paquete de Tercero de Immer
    // - Se realiza con el produce.
    // set(
    //   produce((state: TaskState) => {
    //     state.tasks[newTask.id] = newTask;
    //   })
    // );

    //INFO: Forma Nativa con el ...state.tasks.
    // set((state) => ({
    //   tasks: {
    //     ...state.tasks,
    //     [newTask.id]: newTask,
    //   },
    // }));
  },

  getTaskCount: (): number => Object.values(get().tasks).length,
});

export const useTaskStore = create<TaskState>()(
  persist(devtools(immer(storeApi)), { name: 'task-store' })
);
