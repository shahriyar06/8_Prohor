"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import AddTaskModal from "./AddTaskModal";

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