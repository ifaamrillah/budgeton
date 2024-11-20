import { FieldValues } from "react-hook-form";

import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FormProps } from "@/lib/types";

export const FormCurrency = <T extends FieldValues>({
  form,
  name,
  label,
  required,
  placeholder = "10,000",
  disabled,
  description,
  symbol = "Rp",
}: FormProps<T> & {
  symbol?: string;
}) => {
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {label && <FormLabel required={required}>{label}</FormLabel>}
          <FormControl>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-muted-foreground font-medium text-sm">
                  {symbol}
                </span>
              </div>
              <Input
                id="currency"
                type="text"
                placeholder={placeholder}
                className="pl-10"
                value={
                  field.value === 0 || field.value
                    ? new Intl.NumberFormat().format(Number(field.value))
                    : ""
                }
                onChange={(e) => {
                  const rawAmount = e.target.value.replace(/\D/g, "");
                  const finalAmount = rawAmount === "" ? 0 : Number(rawAmount);
                  field.onChange(finalAmount);
                  const formattedAmount = new Intl.NumberFormat().format(
                    finalAmount
                  );
                  e.target.value = formattedAmount;
                }}
                disabled={disabled}
              />
            </div>
          </FormControl>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
