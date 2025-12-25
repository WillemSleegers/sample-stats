"use client"

import { z } from "zod"
import { useForm, Controller } from "react-hook-form"
import { Dispatch, SetStateAction } from "react"
import { zodResolver } from "@hookform/resolvers/zod"

import {
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { Distribution, Parameters } from "@/lib/types"
import { DEFAULT_PARAMETERS } from "@/lib/constants"

type FormProps = {
  setParams: Dispatch<SetStateAction<Parameters>>
}

// Normal Distribution Form
const normalSchema = z.object({
  mean: z.number(),
  sd: z.number().positive("Standard deviation must be positive"),
})

function FormNormal({ setParams }: FormProps) {
  const form = useForm<z.infer<typeof normalSchema>>({
    resolver: zodResolver(normalSchema),
    defaultValues: {
      mean: DEFAULT_PARAMETERS.normal.mean,
      sd: DEFAULT_PARAMETERS.normal.sd,
    },
  })

  const onSubmit = (data: z.infer<typeof normalSchema>) => {
    setParams({ type: "normal", ...data })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <Controller
        name="mean"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Mean</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              className="bg-background"
              aria-invalid={fieldState.invalid}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
            <FieldDescription>Center of the distribution</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="sd"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Standard deviation</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              className="bg-background"
              aria-invalid={fieldState.invalid}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
            <FieldDescription>
              Spread of the distribution (must be &gt; 0)
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" className="w-full">
        Update Parameters
      </Button>
    </form>
  )
}

// Lognormal Distribution Form
const lognormalSchema = z.object({
  meanlog: z.number(),
  sdlog: z.number().positive("Standard deviation must be positive"),
})

function FormLognormal({ setParams }: FormProps) {
  const form = useForm<z.infer<typeof lognormalSchema>>({
    resolver: zodResolver(lognormalSchema),
    defaultValues: {
      meanlog: DEFAULT_PARAMETERS.lognormal.meanlog,
      sdlog: DEFAULT_PARAMETERS.lognormal.sdlog,
    },
  })

  const onSubmit = (data: z.infer<typeof lognormalSchema>) => {
    setParams({ type: "lognormal", ...data })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <Controller
        name="meanlog"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Mean (log)</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              className="bg-background"
              aria-invalid={fieldState.invalid}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
            <FieldDescription>
              Mean of the underlying normal distribution
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="sdlog"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Standard deviation (log)</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              className="bg-background"
              aria-invalid={fieldState.invalid}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
            <FieldDescription>
              Spread of the underlying normal distribution (must be &gt; 0)
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" className="w-full">
        Update Parameters
      </Button>
    </form>
  )
}

// Uniform Distribution Form
const uniformSchema = z
  .object({
    min: z.number(),
    max: z.number(),
  })
  .refine((data) => data.min < data.max, {
    message: "Minimum must be less than maximum",
    path: ["max"],
  })

function FormUniform({ setParams }: FormProps) {
  const form = useForm<z.infer<typeof uniformSchema>>({
    resolver: zodResolver(uniformSchema),
    defaultValues: {
      min: DEFAULT_PARAMETERS.uniform.min,
      max: DEFAULT_PARAMETERS.uniform.max,
    },
  })

  const onSubmit = (data: z.infer<typeof uniformSchema>) => {
    setParams({ type: "uniform", ...data })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <Controller
        name="min"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Minimum</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              className="bg-background"
              aria-invalid={fieldState.invalid}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
            <FieldDescription>Lower bound of the range</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="max"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Maximum</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              className="bg-background"
              aria-invalid={fieldState.invalid}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
            <FieldDescription>Upper bound of the range</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" className="w-full">
        Update Parameters
      </Button>
    </form>
  )
}

// Beta Distribution Form
const betaSchema = z.object({
  alpha: z.number().positive("Alpha must be positive"),
  beta: z.number().positive("Beta must be positive"),
})

function FormBeta({ setParams }: FormProps) {
  const form = useForm<z.infer<typeof betaSchema>>({
    resolver: zodResolver(betaSchema),
    defaultValues: {
      alpha: DEFAULT_PARAMETERS.beta.alpha,
      beta: DEFAULT_PARAMETERS.beta.beta,
    },
  })

  const onSubmit = (data: z.infer<typeof betaSchema>) => {
    setParams({ type: "beta", ...data })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <Controller
        name="alpha"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Alpha</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              className="bg-background"
              aria-invalid={fieldState.invalid}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
            <FieldDescription>
              First shape parameter (must be &gt; 0)
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="beta"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Beta</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              className="bg-background"
              aria-invalid={fieldState.invalid}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
            <FieldDescription>
              Second shape parameter (must be &gt; 0)
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" className="w-full">
        Update Parameters
      </Button>
    </form>
  )
}

// PERT Distribution Form
const pertSchema = z
  .object({
    min: z.number(),
    mode: z.number(),
    max: z.number(),
  })
  .refine((data) => data.min < data.mode, {
    message: "Minimum must be smaller than mode",
    path: ["min"],
  })
  .refine((data) => data.mode < data.max, {
    message: "Mode must be smaller than maximum",
    path: ["mode"],
  })

function FormPert({ setParams }: FormProps) {
  const form = useForm<z.infer<typeof pertSchema>>({
    resolver: zodResolver(pertSchema),
    defaultValues: {
      min: DEFAULT_PARAMETERS.pert.min,
      mode: DEFAULT_PARAMETERS.pert.mode,
      max: DEFAULT_PARAMETERS.pert.max,
    },
  })

  const onSubmit = (data: z.infer<typeof pertSchema>) => {
    setParams({ type: "pert", ...data })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <Controller
        name="min"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Minimum</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              className="bg-background"
              aria-invalid={fieldState.invalid}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
            <FieldDescription>
              Minimum possible value (must be &lt; mode)
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="mode"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Mode</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              className="bg-background"
              aria-invalid={fieldState.invalid}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
            <FieldDescription>
              Most likely value (must be between min and max)
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="max"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Maximum</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              className="bg-background"
              aria-invalid={fieldState.invalid}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
            <FieldDescription>
              Maximum possible value (must be &gt; mode)
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" className="w-full">
        Update Parameters
      </Button>
    </form>
  )
}

// Metalog Distribution Form
const metalogSchema = z
  .object({
    p10: z.number(),
    p50: z.number(),
    p90: z.number(),
    lower: z.number().optional(),
    upper: z.number().optional(),
  })
  .refine(
    (data) => {
      if (data.lower !== undefined && data.lower !== null) {
        return data.lower < data.p10
      }
      return true
    },
    {
      message: "Lower bound must be less than p10",
      path: ["lower"],
    }
  )
  .refine(
    (data) => {
      if (data.upper !== undefined && data.upper !== null) {
        return data.upper > data.p90
      }
      return true
    },
    {
      message: "Upper bound must be greater than p90",
      path: ["upper"],
    }
  )
  .refine((data) => data.p10 < data.p50, {
    message: "p10 must be less than p50",
    path: ["p50"],
  })
  .refine((data) => data.p50 < data.p90, {
    message: "p50 must be less than p90",
    path: ["p90"],
  })

function FormMetalog({ setParams }: FormProps) {
  const form = useForm<z.infer<typeof metalogSchema>>({
    resolver: zodResolver(metalogSchema),
    defaultValues: {
      p10: DEFAULT_PARAMETERS.metalog.p10,
      p50: DEFAULT_PARAMETERS.metalog.p50,
      p90: DEFAULT_PARAMETERS.metalog.p90,
      lower: undefined,
      upper: undefined,
    },
  })

  const onSubmit = (data: z.infer<typeof metalogSchema>) => {
    setParams({ type: "metalog", ...data })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
      <Controller
        name="p10"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>10th percentile</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              className="bg-background"
              aria-invalid={fieldState.invalid}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
            <FieldDescription>
              10% of values will be below this (must be &lt; p50)
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="p50"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>50th percentile</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              className="bg-background"
              aria-invalid={fieldState.invalid}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
            <FieldDescription>
              Median value (must be between p10 and p90)
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="p90"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>90th percentile</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              className="bg-background"
              aria-invalid={fieldState.invalid}
              onChange={(e) => field.onChange(Number(e.target.value))}
            />
            <FieldDescription>
              90% of values will be below this (must be &gt; p50)
            </FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="lower"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Lower bound</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              placeholder="Optional"
              className="bg-background"
              aria-invalid={fieldState.invalid}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? undefined : Number(e.target.value)
                )
              }
            />
            <FieldDescription>Optional absolute minimum</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Controller
        name="upper"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor={field.name}>Upper bound</FieldLabel>
            <Input
              {...field}
              id={field.name}
              type="number"
              placeholder="Optional"
              className="bg-background"
              aria-invalid={fieldState.invalid}
              value={field.value ?? ""}
              onChange={(e) =>
                field.onChange(
                  e.target.value === "" ? undefined : Number(e.target.value)
                )
              }
            />
            <FieldDescription>Optional absolute maximum</FieldDescription>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <Button type="submit" className="w-full">
        Update Parameters
      </Button>
    </form>
  )
}

// Distribution form switcher
type FormDistributionProps = {
  distribution: Distribution
  setParams: Dispatch<SetStateAction<Parameters>>
}

export default function FormDistribution({
  distribution,
  setParams,
}: FormDistributionProps) {
  switch (distribution) {
    case "normal":
      return <FormNormal setParams={setParams} />
    case "lognormal":
      return <FormLognormal setParams={setParams} />
    case "uniform":
      return <FormUniform setParams={setParams} />
    case "beta":
      return <FormBeta setParams={setParams} />
    case "pert":
      return <FormPert setParams={setParams} />
    case "metalog":
      return <FormMetalog setParams={setParams} />
  }
}
