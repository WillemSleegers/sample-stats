import { Dispatch, forwardRef, SetStateAction } from "react"

import FormNormalDistribution from "@/components/forms/form-normal-distribution"
import FormLognormalDistribution from "@/components/forms/form-lognormal-distribution"
import FormUniformDistribution from "@/components/forms/form-uniform-distribution"
import FormBetaDistribution from "@/components/forms/form-beta-distribution"
import FormPertDistribution from "@/components/forms/form-pert-distribution"
import FormMetalogDistribution from "@/components/forms/form-metalog-distribution"

import { Distribution, FormHandle, Parameters } from "@/lib/types"

type FormDistributionProps = {
  distribution: Distribution
  setParams: Dispatch<SetStateAction<Parameters>>
}

const FormDistribution = forwardRef<FormHandle, FormDistributionProps>(
  ({ distribution, setParams }, ref) => {
    switch (distribution) {
      case "normal":
        return <FormNormalDistribution ref={ref} setParams={setParams} />
      case "lognormal":
        return <FormLognormalDistribution ref={ref} setParams={setParams} />
      case "uniform":
        return <FormUniformDistribution ref={ref} setParams={setParams} />
      case "beta":
        return <FormBetaDistribution ref={ref} setParams={setParams} />
      case "pert":
        return <FormPertDistribution ref={ref} setParams={setParams} />
      case "metalog":
        return <FormMetalogDistribution ref={ref} setParams={setParams} />
      default:
        return null
    }
  }
)

export default FormDistribution

FormDistribution.displayName = "FormDistribution"
