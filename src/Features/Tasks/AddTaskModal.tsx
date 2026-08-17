"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { taskFormSchema, TaskFormValues } from "./taskFormSchema";
import { taskService } from "@/Service/taskService";
import { cn } from "@/lib/utils";

interface AddTaskModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export default function AddTaskModal({
  open,
  onOpenChange,
  onSuccess,
}: AddTaskModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: "",
      description: "",
      dueDate: undefined,
      dueTime: "",
      priority: "medium",
      isRecurring: false,
      recurrenceRule: "",
      tag: "",
      checklistItems: [],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "checklistItems",
  });

  const isRecurring = watch("isRecurring");

  async function onSubmit(data: TaskFormValues) {
    setIsSubmitting(true);
    try {
      const result = await taskService.createTask({
        ...data,
        checklistItems: data.checklistItems?.map((item, index) => ({
          text: item.text,
          order: index,
        })),
        // organizationId, assigneeMemberIds ekhno pathano hocce na —
        // Organization context/store bananor por eta jog hobe.
      });
      toast.success(result.message || "Task created");
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      const err = error as AxiosError<{ message: string }>;
      toast.error(err.response?.data?.message || "Failed to create task");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg md:max-w-xl lg:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
        </DialogHeader>
        <hr />

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 max-h-[80vh] overflow-y-auto no-scrollbar"
        >
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input id="title" {...register("title")} placeholder="Task title" />
            {errors.title && (
              <p className="text-sm text-red-500">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              {...register("description")}
              placeholder="Optional description"
            />
          </div>

          {/* Due Date + Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <Label>
                Due Date <span className="text-red-500">*</span>
              </Label>
              <Controller
                name="dueDate"
                control={control}
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger
                      render={
                        <Button
                          variant="outline"
                          className={cn(
                            "justify-start text-left font-normal",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          <CalendarIcon className="mr-2 size-4" />
                          {field.value
                            ? format(field.value, "PPP")
                            : "Pick a date"}
                        </Button>
                      }
                    />
                    <PopoverContent className="p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
              {errors.dueDate && (
                <p className="text-sm text-red-500">{errors.dueDate.message}</p>
              )}
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dueTime">Due Time</Label>
              <Input id="dueTime" type="time" {...register("dueTime")} />
            </div>
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-1.5">
            <Label>Priority</Label>
            <Controller
              name="priority"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Tag */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tag">Tag</Label>
            <Input id="tag" {...register("tag")} placeholder="Optional tag" />
          </div>

          {/* Recurring */}
          <div className="flex items-center justify-between rounded-md border p-3">
            <div>
              <Label htmlFor="isRecurring">Recurring Task</Label>
              <p className="text-xs text-muted-foreground">
                Repeat this task automatically
              </p>
            </div>
            <Controller
              name="isRecurring"
              control={control}
              render={({ field }) => (
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              )}
            />
          </div>

          {isRecurring && (
            <div className="flex flex-col gap-1.5">
              <Label>Recurrence</Label>
              <Controller
                name="recurrenceRule"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select frequency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">Daily</SelectItem>
                      <SelectItem value="weekly">Weekly</SelectItem>
                      <SelectItem value="monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
            </div>
          )}

          {/* Checklist */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label>Checklist</Label>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => append({ text: "" })}
              >
                <Plus className="size-4 mr-1" />
                Add item
              </Button>
            </div>
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <Checkbox disabled />
                <Input
                  {...register(`checklistItems.${index}.text` as const)}
                  placeholder={`Checklist item ${index + 1}`}
                  className="flex-1"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => remove(index)}
                >
                  <X className="size-4" />
                </Button>
              </div>
            ))}
          </div>

          {/* Organization/Assignee placeholder — org context এখনো নাই বলে skip */}
          {/* TODO: Organization context store বানানোর পর এখানে
              organizationId + assigneeMemberIds (multi-select) যোগ হবে */}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Creating..." : "Create Task"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
