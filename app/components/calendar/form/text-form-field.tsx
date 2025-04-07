import React from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control, FieldPath } from "react-hook-form";
import { FormValues } from "../add-event-dialog";

export type TextFormFieldProps<T extends FormValues> = {
  control: Control<T>;
  name: FieldPath<T>;
  label: string;
  placeholder: string;
};

export function TextFormField<T extends FormValues>({
  control,
  name,
  label,
  placeholder,
}: TextFormFieldProps<T>) {
  return (
    <FormField
      control={control}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      name={name as any} // Using any here as a workaround for TypeScript limitations with FieldPath
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input placeholder={placeholder} {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
