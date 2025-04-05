import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { IconSelector } from "./icon-selector";
import { z } from "zod";
import { formSchema } from "./add-event-dialog";
import { Button } from "@/components/ui/button";

export function EventForm({
  form,
  onSubmit,
}: {
  form: any;
  onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
}) {
  function handleDateSelect(
    date: Date | undefined,
    field: "startedTime" | "endTime"
  ) {
    if (date) {
      form.setValue(field, date);
    }
  }
  function handleTimeChange(
    field: "startedTime" | "endTime",
    type: "hour" | "minute" | "ampm",
    value: string
  ) {
    const currentDate = form.getValues(field) || new Date();
    // eslint-disable-next-line prefer-const
    let newDate = new Date(currentDate);

    if (type === "hour") {
      const hour = parseInt(value, 10);
      newDate.setHours(newDate.getHours() >= 12 ? hour + 12 : hour);
    } else if (type === "minute") {
      newDate.setMinutes(parseInt(value, 10));
    } else if (type === "ampm") {
      const hours = newDate.getHours();
      if (value === "AM" && hours >= 12) {
        newDate.setHours(hours - 12);
      } else if (value === "PM" && hours < 12) {
        newDate.setHours(hours + 12);
      }
    }
    form.setValue(field, newDate);
  }
  return (
    <div>
      <Form {...form}>
        <form
          id="event-form"
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid md:grid-cols-2 gap-5 overflow-y-auto"
        >
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Description</FormLabel>
                <FormControl>
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="startedTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Started Time</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "MM/dd/yyyy hh:mm aa")
                          ) : (
                            <span>MM/DD/YYYY hh:mm aa</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="sm:flex">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) =>
                            handleDateSelect(date, "startedTime")
                          }
                          initialFocus
                        />
                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {Array.from({ length: 12 }, (_, i) => i + 1)
                                .reverse()
                                .map((hour) => (
                                  <Button
                                    key={hour}
                                    size="icon"
                                    variant={
                                      field.value &&
                                      field.value.getHours() % 12 === hour % 12
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() =>
                                      handleTimeChange(
                                        "startedTime",
                                        "hour",
                                        hour.toString()
                                      )
                                    }
                                  >
                                    {hour}
                                  </Button>
                                ))}
                            </div>
                            <ScrollBar
                              orientation="horizontal"
                              className="sm:hidden"
                            />
                          </ScrollArea>
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {Array.from({ length: 12 }, (_, i) => i * 5).map(
                                (minute) => (
                                  <Button
                                    key={minute}
                                    size="icon"
                                    variant={
                                      field.value &&
                                      field.value.getMinutes() === minute
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() =>
                                      handleTimeChange(
                                        "startedTime",
                                        "minute",
                                        minute.toString()
                                      )
                                    }
                                  >
                                    {minute.toString().padStart(2, "0")}
                                  </Button>
                                )
                              )}
                            </div>
                            <ScrollBar
                              orientation="horizontal"
                              className="sm:hidden"
                            />
                          </ScrollArea>
                          <ScrollArea className="">
                            <div className="flex sm:flex-col p-2">
                              {["AM", "PM"].map((ampm) => (
                                <Button
                                  key={ampm}
                                  size="icon"
                                  variant={
                                    field.value &&
                                    ((ampm === "AM" &&
                                      field.value.getHours() < 12) ||
                                      (ampm === "PM" &&
                                        field.value.getHours() >= 12))
                                      ? "default"
                                      : "ghost"
                                  }
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() =>
                                    handleTimeChange(
                                      "startedTime",
                                      "ampm",
                                      ampm
                                    )
                                  }
                                >
                                  {ampm}
                                </Button>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="endTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Time</FormLabel>
                <FormControl>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "MM/dd/yyyy hh:mm aa")
                          ) : (
                            <span>MM/DD/YYYY hh:mm aa</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <div className="sm:flex">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={(date) => handleDateSelect(date, "endTime")}
                          initialFocus
                        />
                        <div className="flex flex-col sm:flex-row sm:h-[300px] divide-y sm:divide-y-0 sm:divide-x">
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {Array.from({ length: 12 }, (_, i) => i + 1)
                                .reverse()
                                .map((hour) => (
                                  <Button
                                    key={hour}
                                    size="icon"
                                    variant={
                                      field.value &&
                                      field.value.getHours() % 12 === hour % 12
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() =>
                                      handleTimeChange(
                                        "endTime",
                                        "hour",
                                        hour.toString()
                                      )
                                    }
                                  >
                                    {hour}
                                  </Button>
                                ))}
                            </div>
                            <ScrollBar
                              orientation="horizontal"
                              className="sm:hidden"
                            />
                          </ScrollArea>
                          <ScrollArea className="w-64 sm:w-auto">
                            <div className="flex sm:flex-col p-2">
                              {Array.from({ length: 12 }, (_, i) => i * 5).map(
                                (minute) => (
                                  <Button
                                    key={minute}
                                    size="icon"
                                    variant={
                                      field.value &&
                                      field.value.getMinutes() === minute
                                        ? "default"
                                        : "ghost"
                                    }
                                    className="sm:w-full shrink-0 aspect-square"
                                    onClick={() =>
                                      handleTimeChange(
                                        "endTime",
                                        "minute",
                                        minute.toString()
                                      )
                                    }
                                  >
                                    {minute.toString().padStart(2, "0")}
                                  </Button>
                                )
                              )}
                            </div>
                            <ScrollBar
                              orientation="horizontal"
                              className="sm:hidden"
                            />
                          </ScrollArea>
                          <ScrollArea className="">
                            <div className="flex sm:flex-col p-2">
                              {["AM", "PM"].map((ampm) => (
                                <Button
                                  key={ampm}
                                  size="icon"
                                  variant={
                                    field.value &&
                                    ((ampm === "AM" &&
                                      field.value.getHours() < 12) ||
                                      (ampm === "PM" &&
                                        field.value.getHours() >= 12))
                                      ? "default"
                                      : "ghost"
                                  }
                                  className="sm:w-full shrink-0 aspect-square"
                                  onClick={() =>
                                    handleTimeChange("endTime", "ampm", ampm)
                                  }
                                >
                                  {ampm}
                                </Button>
                              ))}
                            </div>
                          </ScrollArea>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="icon"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Icon</FormLabel>
                <FormControl>
                  <IconSelector
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    name={field.name}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </div>
  );
}
