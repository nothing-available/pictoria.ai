"use client";

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
import { toast } from "sonner";
import { useId } from "react";
import { getPreSignedStorageUrl } from "@/actions/model-action";

function ModelTrainingForm() {
  const toastId = useId();

  const form = useForm<z.infer<typeof modelTrainingSchema>>({
    resolver: zodResolver(modelTrainingSchema),
    defaultValues: {
      modelName: "",
      gender: "man",
      zipfile: undefined,
    },
  });

  const fileRef = form.register("zipfile");

  async function onSubmit(values: z.infer<typeof modelTrainingSchema>) {
    toast.loading("Uploading your file...", { id: toastId });

    try {
      const data = await getPreSignedStorageUrl(values.zipfile[0].name);
      console.log(data);

      if (data.error) {
        toast.error(data.error || 'Failed to upload file!', { id: toastId });
        return;
      }
      //uploading file
      const urlResponse = await fetch(data.signedUrl, {
        method: 'PUT',
        headers: {
          'Content-Type': values.zipfile[0].type,
        },
        body: values.zipfile[0],
      });

      if (!urlResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const res = await urlResponse.json();
      toast.success("File uploaded successfully!", { id: toastId });
      console.log(res);

      const formData = new FormData();
      formData.append('fileKey', res.Key);
      formData.append('modelName', values.modelName);
      formData.append('gender', values.gender);

      //use the /train handler
      const response = await fetch('/api/train', {
        method: 'POST',
        body: formData,
      });

      const results = await response.json();
      if (!response.ok || results?.error) {
        throw new Error(results?.error || 'Failed to start training');
      }
      toast.success("Training started successfully! You will recieve notification once it gets completed ", { id: toastId });


    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to start training';
      toast.error(errorMessage, { id: toastId, duration: 500 });
    }

    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <fieldset className="grid max-w-5xl bg-background p-8 rounded-lg gap-6 border">
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

          {/* Removed the nested form and kept just the RadioGroup */}
          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Please select the gender of the image.</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="man" />
                      </FormControl>
                      <FormLabel className="font-normal">Male</FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="women" />
                      </FormControl>
                      <FormLabel className="font-normal">Female</FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="zipfile"
            render={() => (
              <FormItem>
                <FormLabel>
                  Training Data (Zip File) |{" "}
                  <span className="text-destructive">
                    {" "}
                    Read the requirement below
                  </span>
                </FormLabel>

                <div className="mb-4 rounded-lg shadow-sm pb-4 text-card-foreground">
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Provide 10, 12 or 15 images in total</li>
                    <li>• Ideal breakdown for 12 images:</li>
                    <ul className="ml-4 mt-1 space-y-4">
                      <li>- 6 face closeups</li>
                      <li>- 3/4 half body closeups (till stomach)</li>
                      <li>- 2/3 full body shots</li>
                    </ul>
                    <li>• No accessories on face/head ideally</li>
                    <li>• No other people in images</li>
                    <li>
                      • Different expressions, clothing, backgrounds with good
                      lighting
                    </li>
                    <li>
                      • Images to be in 1:1 resolution (1048x1048 or higher)
                    </li>
                    <li>
                      • Use images of similar age group (ideally within past few
                      months)
                    </li>
                    <li>• Provide only zip file (under 45MB size)</li>
                  </ul>
                </div>

                <FormControl>
                  <Input type="file" accept=".zip" {...fileRef} />
                </FormControl>
                <FormDescription>
                  Upload a zip file containing images for training.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-fit">
            Submit
          </Button>
        </fieldset>
      </form>
    </Form>
  );
}

export default ModelTrainingForm;