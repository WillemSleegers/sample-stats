"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import {
  Dispatch,
  forwardRef,
  SetStateAction,
  useImperativeHandle,
} from "react"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import { FormHandle, Parameters } from "@/lib/types"

import { DEFAULT_PARAMETERS } from "@/lib/constants"

const formSchema = z
  .object({
    min: z.coerce.number(),
    mode: z.coerce.number(),
    max: z.coerce.number(),
  })
  .refine((data) => data.min < data.mode, {
    message: "Minimum must be smaller than mode",
    path: ["min"],
  })
  .refine((data) => data.mode < data.max, {
    message: "Mode must be smaller than maximum",
    path: ["mode"],
  })

type FormPertDistributionProps = {
  setParams: Dispatch<SetStateAction<Parameters>>
}

const FormPertDistribution = forwardRef<FormHandle, FormPertDistributionProps>(
  ({ setParams }, ref) => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        min: DEFAULT_PARAMETERS.pert.min,
        mode: DEFAULT_PARAMETERS.pert.mode,
        max: DEFAULT_PARAMETERS.pert.max,
      },
    })

    useImperativeHandle(ref, () => ({
      submitForm: () => {
        form.handleSubmit(onSubmit)()
      },
    }))

    function onSubmit(values: z.infer<typeof formSchema>) {
      setParams(values)
    }

    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
          <FormField
            control={form.control}
            name="min"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Minimum</FormLabel>
                <FormControl>
                  <Input type="number" className="bg-background" {...field} />
                </FormControl>
                <FormDescription>Minimum possible value (must be &lt; mode)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="mode"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Mode</FormLabel>
                <FormControl>
                  <Input type="number" className="bg-background" {...field} />
                </FormControl>
                <FormDescription>Most likely value (must be between min and max)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="max"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Maximum</FormLabel>
                <FormControl>
                  <Input type="number" className="bg-background" {...field} />
                </FormControl>
                <FormDescription>Maximum possible value (must be &gt; mode)</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    )
  }
)

FormPertDistribution.displayName = "FormPertDistribution"

export default FormPertDistribution
