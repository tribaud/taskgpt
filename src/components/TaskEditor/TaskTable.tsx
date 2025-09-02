import React from "react";
import TaskRow from "./TaskRow";
import { Task } from "./TaskEditor";

type TaskTableProps = {
  tasks: Task[];
  onEditTask: (index: number, updated: Partial<Task>) => void;
  onDeleteTask: (index: number) => void;
};

const TaskTable: React.FC<TaskTableProps> = ({ tasks, onEditTask, onDeleteTask }) => {
  return (
    <div style={{ overflow: "auto", maxHeight: "60vh" }}>
      <table>
        <thead>
          <tr>
            <th style={{ width: 60 }}>Done</th>
            <th style={{ width: 110 }}>ID</th>
            <th>Title</th>
            <th>Description</th>
            <th style={{ width: 120 }}>Priority</th>
            <th>Dependencies</th>
            <th>Tags</th>
            <th style={{ width: 120 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task, idx) => (
            <TaskRow
              key={task.id}
              task={task}
              index={idx}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
