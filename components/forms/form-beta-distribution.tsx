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
  alpha: z.coerce.number(),
  beta: z.coerce.number(),
})

type FormBetaDistributionProps = {
  setParams: Dispatch<SetStateAction<Parameters>>
}

const FormBetaDistribution = forwardRef<FormHandle, FormBetaDistributionProps>(
  ({ setParams }, ref) => {
    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema),
      defaultValues: {
        alpha: DEFAULT_PARAMETERS.beta.alpha,
        beta: DEFAULT_PARAMETERS.beta.beta,
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
            name="alpha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Alpha</FormLabel>
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
            name="beta"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Beta</FormLabel>
                <FormControl>
                  <Input type="number" className="bg-background" {...field} />
                </FormControl>
                <FormDescription></FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    )
  }
)

export default FormBetaDistribution

FormBetaDistribution.displayName = "FormBetaDistribution"
