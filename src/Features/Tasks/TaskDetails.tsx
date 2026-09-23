"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddTaskModal from "./AddTaskModal";
import HeadCard from "@/components/common/HeadCard";
import tasks from "@/assets/Tasks.png";
import ACtasks from "@/assets/ACTask.png";
import IACtasks from "@/assets/IACTask.png";

export default function TaskDetails() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Tasks</h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            Plan, organize and manage your tasks while tracking their progress.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Add Task</Button>
      </div>
      <hr className="mb-4 mt-2" />

      <div className="pb-5 grid grid-cols-3 gap-5">
        <HeadCard
          title="Total Tasks"
          value="10"
          description="All tasks across your workspace"
          icon={tasks}
        />
        <HeadCard
          title="Completed Tasks"
          value="8"
          description="Successfully completed tasks"
          icon={ACtasks}
        />
        <HeadCard
          title="Pending Tasks"
          value="2"
          description="Tasks waiting to be completed"
          icon={IACtasks}
        />
      </div>

      <AddTaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => {
          // pore eikhane task list refetch korar logic bosbe
        }}
      />
    </div>
  );
}
