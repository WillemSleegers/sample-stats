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

const formSchema = z.object({
  min: z.coerce.number<number>(),
  max: z.coerce.number<number>(),
})

type FormUniformDistributionProps = {
  setParams: Dispatch<SetStateAction<Parameters>>
}

const FormUniformDistribution = forwardRef<
  FormHandle,
  FormUniformDistributionProps
>(({ setParams }, ref) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      min: DEFAULT_PARAMETERS.uniform.min,
      max: DEFAULT_PARAMETERS.uniform.max,
    },
  })

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      form.handleSubmit(onSubmit)()
    },
  }))

  function onSubmit(values: z.infer<typeof formSchema>) {
    setParams({ type: "uniform", ...values })
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
      </form>
    </Form>
  )
})

export default FormUniformDistribution

FormUniformDistribution.displayName = "FormUniformDistribution"
