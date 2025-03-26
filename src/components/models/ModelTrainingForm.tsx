'use client';

import { Button } from "@/components/ui/button";
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
import { modelTrainingSchema } from "@/schema/modelTraining-schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";


function ModelTrainingForm() {

  const form = useForm<z.infer<typeof modelTrainingSchema>>({
    resolver: zodResolver(modelTrainingSchema),
    defaultValues: {
      modelName: "",
      gender: "man",
      zipfile: undefined
    }
  });

  function onSubmit(values: z.infer<typeof modelTrainingSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>

      <fieldset className="grid max-w-5xl bg-background p-8 rounded-lg gap-6">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="modelName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Model Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter your model name" {...field} />
                </FormControl>
                <FormDescription>
                  This will be the name of your model.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormLabel>Please select the images of the images.</FormLabel>
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="flex flex-col space-y-1"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="men" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Male
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="women" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            Female
                          </FormLabel>
                        </FormItem>

                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>

          <Button type="submit">Submit</Button>
        </form>
      </fieldset>
    </Form>
  );
}

export default ModelTrainingForm;