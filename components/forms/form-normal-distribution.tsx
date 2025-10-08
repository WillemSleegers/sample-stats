"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import {
  Dispatch,
  SetStateAction,
  forwardRef,
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
  mean: z.coerce.number<number>(),
  sd: z.coerce.number<number>(),
})

type FormNormalDistributionProps = {
  setParams: Dispatch<SetStateAction<Parameters>>
}

const FormNormalDistribution = forwardRef<
  FormHandle,
  FormNormalDistributionProps
>(({ setParams }, ref) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mean: DEFAULT_PARAMETERS.normal.mean,
      sd: DEFAULT_PARAMETERS.normal.sd,
    },
  })

  useImperativeHandle(ref, () => ({
    submitForm: () => {
      form.handleSubmit(onSubmit)()
    },
  }))

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    setParams({ type: "normal", ...values })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="mean"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mean</FormLabel>
              <FormControl>
                <Input type="number" className="bg-background" {...field} />
              </FormControl>
              <FormDescription>Center of the distribution</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sd"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Standard deviation</FormLabel>
              <FormControl>
                <Input type="number" className="bg-background" {...field} />
              </FormControl>
              <FormDescription>
                Spread of the distribution (must be &gt; 0)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  )
})

export default FormNormalDistribution

FormNormalDistribution.displayName = "FormNormalDistribution"
