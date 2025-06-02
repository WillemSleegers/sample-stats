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

const formSchema = z.object({
  meanlog: z.coerce.number(),
  sdlog: z.coerce.number(),
})

type FormLognormalDistributionProps = {
  setParams: Dispatch<SetStateAction<Parameters>>
}

const FormLognormalDistribution = ({
  setParams,
}: FormLognormalDistributionProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      meanlog: DEFAULT_PARAMETERS.lognormal.meanlog,
      sdlog: DEFAULT_PARAMETERS.lognormal.sdlog,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setParams(values)
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="meanlog"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mean (log)</FormLabel>
              <FormControl>
                <Input type="number" className="bg-background" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="sdlog"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Standard deviation (log)</FormLabel>
              <FormControl>
                <Input type="number" className="bg-background" {...field} />
              </FormControl>
              <FormDescription></FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" variant="outline" className="">
          Update parameters
        </Button>
      </form>
    </Form>
  )
}

export default FormLognormalDistribution
