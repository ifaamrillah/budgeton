/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { FieldValues, Path, PathValue } from "react-hook-form";
import { Check, ChevronsUpDown } from "lucide-react";

import { useDebounce } from "@/hooks/use-debounce";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { FormProps } from "@/lib/types";
import { cn } from "@/lib/utils";

export const FormCombobox = <T extends FieldValues>({
  form,
  name,
  label,
  required,
  placeholder = "Select options",
  disabled,
  description,
  defaultValue,
  fetchOptions,
}: FormProps<T> & {
  defaultValue?: {
    value: unknown;
    label: string;
  };
  fetchOptions: (search: string) => Promise<PathValue<T, Path<T>>>;
}) => {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [filterName, setFilterName] = useState<string>("");

  const debouncedFilterName = useDebounce(filterName, 500);

  const { data: options, isLoading } = useQuery({
    queryKey: ["accountOptions", debouncedFilterName],
    queryFn: () => fetchOptions(debouncedFilterName),
    enabled: !!debouncedFilterName,
  });

  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <div className="w-full">
            <Popover open={isOpen} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      "justify-between w-full",
                      !field.value && "text-muted-foreground"
                    )}
                    disabled={disabled}
                  >
                    {field.value
                      ? options
                        ? options?.find(
                            (option: any) => option.value === field.value
                          )?.label
                        : defaultValue?.label
                      : placeholder}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent align="start" className="p-0">
                <Command>
                  <CommandInput
                    placeholder="Search option..."
                    value={filterName}
                    onValueChange={setFilterName}
                  />
                  <CommandList>
                    <CommandEmpty>
                      {isLoading ? "Searching..." : "No option found."}
                    </CommandEmpty>
                    <CommandGroup>
                      {options?.map((option: any) => (
                        <CommandItem
                          value={option.label}
                          key={option.value}
                          onSelect={() => {
                            form.setValue(name, option.value);
                            setOpen(false);
                          }}
                        >
                          {option.label}
                          <Check
                            className={cn(
                              "ml-auto",
                              option.value === field.value
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
