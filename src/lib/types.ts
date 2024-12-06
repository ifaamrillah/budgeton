import { FieldValues, Path, UseFormReturn } from "react-hook-form";

export type FormProps<T extends FieldValues> = {
  form: UseFormReturn<T>;
  name: Path<T>;
  label?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  description?: string;
  className?: string;
};
