"use client";

import { z } from "zod";
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
import { useId, useState } from "react";
import { toast } from "sonner";
import { signIn } from "@/actions/auth-actions";
import { redirect } from "next/navigation";
import { Loader } from "lucide-react";

const formSchema = z.object({
  email: z.string().email({
    message: "Please enter valid email address",
  }),
  password: z.string().min(8, {
    message: "Password must be atleast 8 characters",
  }),
});

export function LoginForm({ className }: { className?: string; }) {

  const [loading, setLoading] = useState(false);

  const toastId = useId();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {

    toast.loading("Logging in...", { id: toastId });
    setLoading(true);

    const formData = new FormData();
    formData.append("email", values.email);
    formData.append("password", values.password);

    const { error, success } = await signIn(formData);
    if (!success) {
      toast.error(error || "Sign in failed", { id: toastId });
      setLoading(false);
    } else {
      toast.success("Sign in successful!", { id: toastId });
      setLoading(false);
      redirect('/dashboard');
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
                    type="password"
                    placeholder='Enter your password'
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type='submit'
            className="w-full"
          >
            {loading && <Loader className='mr-2 h-4 w-4 animate-spin' />}
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
}
