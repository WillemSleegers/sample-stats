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
    p10: z.coerce.number<number>(),
    p50: z.coerce.number<number>(),
    p90: z.coerce.number<number>(),
    lower: z.coerce.number<number>().optional(),
    upper: z.coerce.number<number>().optional(),
  })
  .refine(
    (data) => {
      if (data.lower) {
        return data.lower < data.p10
      } else return true
    },
    {
      message: "The lower bound must be smaller than the 10th percentile",
      path: ["lower"],
    }
  )
  .refine((data) => data.p10 < data.p50, {
    message: "The 10th percentile must be smaller than the 50th percentile",
    path: ["p10"],
  })
  .refine((data) => data.p50 < data.p90, {
    message: "The 50th percentile must be smaller than the 90th percentile",
    path: ["p50"],
  })
  .refine(
    (data) => {
      if (data.upper) {
        return data.p90 < data.upper
      } else return true
    },
    {
      message: "The 90th percentile must be smaller than the upper bound",
      path: ["p90"],
    }
  )

type FormMetalogDistributionProps = {
  setParams: Dispatch<SetStateAction<Parameters>>
}

const FormMetalogDistribution = forwardRef<
  FormHandle,
  FormMetalogDistributionProps
>(({ setParams }, ref) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      p10: DEFAULT_PARAMETERS.metalog.p10,
      p50: DEFAULT_PARAMETERS.metalog.p50,
      p90: DEFAULT_PARAMETERS.metalog.p90,
    },
  })

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      form.handleSubmit(onSubmit)()
    },
  }))

  function onSubmit(values: z.infer<typeof formSchema>) {
    setParams({ type: "metalog", ...values })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="p10"
          render={({ field }) => (
            <FormItem>
              <FormLabel>10th percentile</FormLabel>
              <FormControl>
                <Input type="number" className="bg-background" {...field} />
              </FormControl>
              <FormDescription>
                10% of values will be below this (must be &lt; p50)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="p50"
          render={({ field }) => (
            <FormItem>
              <FormLabel>50th percentile</FormLabel>
              <FormControl>
                <Input type="number" className="bg-background" {...field} />
              </FormControl>
              <FormDescription>
                Median value (must be between p10 and p90)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="p90"
          render={({ field }) => (
            <FormItem>
              <FormLabel>90th percentile</FormLabel>
              <FormControl>
                <Input type="number" className="bg-background" {...field} />
              </FormControl>
              <FormDescription>
                90% of values will be below this (must be &gt; p50)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lower"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Lower bound</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Optional"
                  className="bg-background"
                  {...field}
                />
              </FormControl>
              <FormDescription>Optional absolute minimum</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="upper"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upper bound</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="Optional"
                  className="bg-background"
                  {...field}
                />
              </FormControl>
              <FormDescription>Optional absolute maximum</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})

export default FormMetalogDistribution

FormMetalogDistribution.displayName = "FormMetalogDistribution"
