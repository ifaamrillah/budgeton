"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { toast } from "sonner";

import { createAccount } from "@/services/account";

import { Button } from "@/components/ui/button";
import {
  Credenza,
  CredenzaBody,
  CredenzaClose,
  CredenzaContent,
  CredenzaFooter,
  CredenzaHeader,
  CredenzaTitle,
} from "@/components/ui/credenza";
import { CreateAccountValidator } from "@/validator/account-validator";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export default function AddAccountButton() {
  const [isOpen, setOpen] = useState<boolean>(false);

  const form = useForm<z.infer<typeof CreateAccountValidator>>({
    resolver: zodResolver(CreateAccountValidator),
    defaultValues: {
      name: "",
      startingBalance: 0,
      status: true,
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: createAccount,
    onSuccess: () => {
      toast.success("Create account successfully");
    },
    onError: () => {
      toast.error("Create account failed");
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  const onSubmit = async (values: z.infer<typeof CreateAccountValidator>) => {
    mutate({ ...values, startingBalance: Number(values.startingBalance) });
  };

  return (
    <>
      <Button onClick={() => setOpen(true)}>
        <PlusCircle /> Add Account
      </Button>
      <Credenza open={isOpen} onOpenChange={setOpen}>
        <CredenzaContent>
          <CredenzaHeader>
            <CredenzaTitle>Add New Account</CredenzaTitle>
          </CredenzaHeader>
          <CredenzaBody>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Bank Account"
                          {...field}
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startingBalance"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Starting Balance</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          min={0}
                          placeholder="10000"
                          onChange={(event) =>
                            field.onChange(+event.target.value)
                          }
                          disabled={isPending}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel required>Status</FormLabel>
                      <div className="flex flex-row items-center justify-between rounded-lg border p-4">
                        <div className="space-y-0.5">
                          <FormDescription>
                            You can make account active or nonactive.
                          </FormDescription>
                        </div>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isPending}
                          />
                        </FormControl>
                      </div>
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CredenzaBody>
          <CredenzaFooter>
            <CredenzaClose asChild>
              <Button variant="outline" disabled={isPending}>
                Cancel
              </Button>
            </CredenzaClose>
            <Button
              onClick={() => form.handleSubmit(onSubmit)()}
              disabled={isPending}
            >
              {isPending ? "Saving..." : "Save"}
            </Button>
          </CredenzaFooter>
        </CredenzaContent>
      </Credenza>
    </>
  );
}
