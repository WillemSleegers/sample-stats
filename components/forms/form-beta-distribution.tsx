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
  alpha: z.coerce.number<number>().positive("Alpha must be positive"),
  beta: z.coerce.number<number>().positive("Beta must be positive"),
})

type FormBetaDistributionProps = {
  setParams: Dispatch<SetStateAction<Parameters>>
  onUpdate: () => void
}

const FormBetaDistribution = ({
  setParams,
  onUpdate,
}: FormBetaDistributionProps) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      alpha: DEFAULT_PARAMETERS.beta.alpha,
      beta: DEFAULT_PARAMETERS.beta.beta,
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    setParams({ type: "beta", ...values })
    onUpdate()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="alpha"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Alpha</FormLabel>
              <FormControl>
                <Input type="number" className="bg-background" {...field} />
              </FormControl>
              <FormDescription>
                First shape parameter (must be &gt; 0)
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="beta"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Beta</FormLabel>
              <FormControl>
                <Input type="number" className="bg-background" {...field} />
              </FormControl>
              <FormDescription>
                Second shape parameter (must be &gt; 0)
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

export default FormBetaDistribution
