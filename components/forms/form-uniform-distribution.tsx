"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { Dispatch, SetStateAction } from "react"
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
import { Button } from "@/components/ui/button"

import { Parameters } from "@/lib/types"

import { DEFAULT_PARAMETERS } from "@/lib/constants"

const formSchema = z
  .object({
    min: z.coerce.number<number>(),
    max: z.coerce.number<number>(),
  })
  .refine((data) => data.min < data.max, {
    message: "Minimum must be less than maximum",
    path: ["max"],
  })

type FormUniformDistributionProps = {
  setParams: Dispatch<SetStateAction<Parameters>>
  onUpdate: () => void
}

const FormUniformDistribution = ({
  setParams,
  onUpdate,
}: FormUniformDistributionProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      min: DEFAULT_PARAMETERS.uniform.min,
      max: DEFAULT_PARAMETERS.uniform.max,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setParams({ type: "uniform", ...values })
    onUpdate()
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
              <FormDescription>Lower bound of the range</FormDescription>
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
              <FormDescription>Upper bound of the range</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full">
          Update Parameters
        </Button>
      </form>
    </Form>
  )
}

export default FormUniformDistribution
