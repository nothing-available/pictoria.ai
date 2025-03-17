"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { signUpFormSchema } from "@/lib/auth-schema";
import { useId, useState } from "react";
import { Loader } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import { signUp } from "@/actions/auth-actions";
import { redirect } from "next/navigation";

export function SignupForm({ className }: { className?: string; }) {

  const [loading, setLoading] = useState(false);

  const toastId = useId();

  const form = useForm<z.infer<typeof signUpFormSchema>>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      email: "",
      password: "",
      full_name: "",
      confirm_password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signUpFormSchema>) {

    toast.loading("Signing up...", { id: toastId });
    setLoading(true);

    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);
    formData.append("full_name", values.full_name);

    const { error, success } = await signUp(formData);

    if (!success) {
      toast.error(error || "Sign up failed", { id: toastId });
      setLoading(false);
    } else {
      toast.success("Sign up successful! Please confirm your email", { id: toastId });
      setLoading(false);
      redirect('/login'); 
    }

  }

  return (
    <div className={cn("grid gap-6", className)}>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className='space-y-4'>
          <FormField
            control={form.control}
            name='full_name'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input
                    placeholder='Enter your full name'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    placeholder='name@example.com'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Enter your password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name='confirm_password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type='password'
                    placeholder='Confirm your password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type='submit' className='w-full' disabled={loading}>

            {loading && <Loader className='mr-2 h-4 w-4 animate-spin' />}
            Sign up
          </Button>
        </form>
      </Form>
    </div>
  );
}