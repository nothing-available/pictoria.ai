'use client';
import { imageGenerationFormSchema } from '@/schema/imageGeneration-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useEffect } from 'react';
import { useForm } from "react-hook-form";
import { z } from 'zod';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from '../ui/slider';
import { Textarea } from '../ui/textarea';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Info } from 'lucide-react';
import useGenerateStore from '@/store/useGeneratedStore';


const Configuration = () => {

  const generateImage = useGenerateStore((state) => state.generateImage);

  const form = useForm<z.infer<typeof imageGenerationFormSchema>>({
    resolver: zodResolver(imageGenerationFormSchema),
    defaultValues: {
      model: 'black-forest-labs/flux-dev',
      prompt: '',
      guidances: 3.5,
      num_outputs: 1,
      aspect_ratio: "1:1",
      output_format: 'jpg',
      output_quality: 80,
      num_inference_steps: 28
    }
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === 'model') {
        let newSteps;

        if (value.model === 'black-forest-labs/flux-schnell') {
          newSteps = 3;
        } else {
          newSteps = 28;
        }
        if (newSteps !== undefined) {
          form.setValue('num_inference_steps', newSteps);
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(values: z.infer<typeof imageGenerationFormSchema>) {
    await generateImage(values);
  }

  return (
    <TooltipProvider>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

          <fieldset className='grid gap-6 p-4 bg-background rounded-lg border'>

            <legend className='text-sm -ml-1 px-1 font-medium'>
              Settings
            </legend>

            <FormField
              control={form.control}
              name="model"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-1'>
                    Modal
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className='w-4 h-4' />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p> You can select any model from the dropdown menu.</p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the modal" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="black-forest-labs/flux-dev">Flux Dev</SelectItem>
                      <SelectItem value="black-forest-labs/flux-schnell">Flux Schnell</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              {/* Aspect Ratio Field */}
              <FormField
                control={form.control}
                name="aspect_ratio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-1'>
                      Aspect Ratio
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className='w-4 h-4' />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p> Aspect ratio for the generated image. </p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select the aspect ratio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {imageGenerationFormSchema.shape.aspect_ratio.options.map((ratio) => (
                          <SelectItem key={ratio} value={ratio}>
                            {ratio}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Number of Outputs Field */}
              <FormField
                control={form.control}
                name="num_outputs"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className='flex items-center gap-1'>
                      Number of Outputs
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className='w-4 h-4' />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p> Total number of output images to generate.</p>
                        </TooltipContent>
                      </Tooltip>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={1}
                        max={4}
                        {...field}
                        onChange={(e) => field.onChange(parseInt(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="guidances"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center justify-between'>
                    <div className='flex items-center gap-1'>
                      Guidances
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className='w-4 h-4' />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Prompt Guidance for generated image.</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span>{field.value}</span>
                  </FormLabel>
                  <FormControl>
                    <Slider defaultValue={[field.value]} min={0} max={10} step={0.5}
                      onValueChange={value => field.onChange(value[0])} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="num_inference_steps"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center justify-between'>
                    <div>
                      Number Inference Steps
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className='w-4 h-4' />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Number of denoising steps. Recomended range is 28-50 for dev model and 1-4 for schnell model
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span>{field.value}</span>
                  </FormLabel>
                  <FormControl>
                    <Slider defaultValue={[field.value]} min={1} max={
                      form.getValues('model') === 'black-forest-labs/flux-schnell' ? 4 : 50
                    } step={1}
                      onValueChange={value => field.onChange(value[0])} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Output Quality Slider */}
            <FormField
              control={form.control}
              name="output_quality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center justify-between'>
                    <div className='flex items-center gap-1'>
                      Output Quality
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className='w-4 h-4' />
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>
                            Quality for saving the output image,from 0 to 100. 100 is the best quality, 0 is the worst.
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </div>
                    <span>{field.value}</span>
                  </FormLabel>
                  <FormControl>
                    <Slider defaultValue={[field.value]} min={50} max={100} step={1}
                      onValueChange={value => field.onChange(value[0])} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Output Format Field */}
            <FormField
              control={form.control}
              name="output_format"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-1'>
                    Output Format
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className='w-4 h-4' />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Fromat of the output image.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the output format" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {imageGenerationFormSchema.shape.output_format.options.map((format) => (
                        <SelectItem key={format} value={format}>
                          {format.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Prompt Field */}
            <FormField
              control={form.control}
              name="prompt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className='flex items-center gap-1'>
                    Prompt
                    <Tooltip>
                      <TooltipTrigger>
                        <Info className='w-4 h-4' />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>
                          Prompt for generated image.
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </FormLabel>
                  <FormControl>
                    <Textarea placeholder="Enter a prompt" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4">
              <Button type="submit">Generate</Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => form.reset()}
              >
                Reset
              </Button>
            </div>


          </fieldset>

        </form>
      </Form >
    </TooltipProvider>
  );
};

export default Configuration;