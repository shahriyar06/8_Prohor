import HeadCard from "@/components/common/HeadCard";
import { Button } from "@/components/ui/button";
import { useState } from "react";

export default function ExpenseDetails() {
  const [modalOpen, setModalOpen] = useState(false);
  
  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Expense</h1>
          <p className="text-muted-foreground text-xs md:text-sm">
            Track and manage your expense sources.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>Add Expense</Button>
      </div>
      <hr className="mb-4 mt-2" />

      <div className="pb-5 grid grid-cols-3 gap-5">
        <HeadCard
          title="Total Expense"
          value="$500"
          className="text-red-500"
          description="All expense sources"
          icon={expense}
        />
        <HeadCard
          title="Total Paid"
          value="8"
          className="text-green-500"
          description="Successfully added expense sources"
          icon={paid}
        />
        <HeadCard
          title="Total Due"
          value="2"
          className="text-red-500"
          description="Expense sources waiting to be added"
          icon={due}
        />
      </div>

      {/* <AddTaskModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        onSuccess={() => {
          // pore eikhane task list refetch korar logic bosbe
        }}
      /> */}
    </div>
  );
}
