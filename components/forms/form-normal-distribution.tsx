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
  mean: z.coerce.number<number>(),
  sd: z.coerce.number<number>().positive("Standard deviation must be positive"),
})

type FormNormalDistributionProps = {
  setParams: Dispatch<SetStateAction<Parameters>>
  onUpdate: () => void
}

const FormNormalDistribution = ({
  setParams,
  onUpdate,
}: FormNormalDistributionProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mean: DEFAULT_PARAMETERS.normal.mean,
      sd: DEFAULT_PARAMETERS.normal.sd,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setParams({ type: "normal", ...values })
    onUpdate()
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
        <Button type="submit" className="w-full">
          Update Parameters
        </Button>
      </form>
    </Form>
  )
}

export default FormNormalDistribution
