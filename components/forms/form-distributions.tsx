import { Dispatch, SetStateAction } from "react"

import FormNormalDistribution from "@/components/forms/form-normal-distribution"
import FormLognormalDistribution from "@/components/forms/form-lognormal-distribution"
import FormUniformDistribution from "@/components/forms/form-uniform-distribution"
import FormBetaDistribution from "@/components/forms/form-beta-distribution"
import FormPertDistribution from "@/components/forms/form-pert-distribution"
import FormMetalogDistribution from "@/components/forms/form-metalog-distribution"

import { Distribution, Parameters } from "@/lib/types"

type FormDistributionProps = {
  distribution: Distribution
  setParams: Dispatch<SetStateAction<Parameters>>
  onUpdate: () => void
}

const FormDistribution = ({ distribution, setParams, onUpdate }: FormDistributionProps) => {
  switch (distribution) {
    case "normal":
      return <FormNormalDistribution setParams={setParams} onUpdate={onUpdate} />
    case "lognormal":
      return <FormLognormalDistribution setParams={setParams} onUpdate={onUpdate} />
    case "uniform":
      return <FormUniformDistribution setParams={setParams} onUpdate={onUpdate} />
    case "beta":
      return <FormBetaDistribution setParams={setParams} onUpdate={onUpdate} />
    case "pert":
      return <FormPertDistribution setParams={setParams} onUpdate={onUpdate} />
    case "metalog":
      return <FormMetalogDistribution setParams={setParams} onUpdate={onUpdate} />
    default:
      return null
  }
}

export default FormDistribution
