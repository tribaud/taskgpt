import React from "react";
import TaskRow from "./TaskRow";
import { Task } from "./TaskEditor";

type TaskTableProps = {
  tasks: Task[];
};

const TaskTable: React.FC<TaskTableProps> = ({ tasks }) => {
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
            <TaskRow key={task.id} task={task} index={idx} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TaskTable;
