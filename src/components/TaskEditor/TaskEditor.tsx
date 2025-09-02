import React from "react";
import Toolbar from "./Toolbar";
import TaskTable from "./TaskTable";

const TaskEditor: React.FC = () => (
  <div>
    <Toolbar />
    <TaskTable />
  </div>
);

export default TaskEditor;
