import { Distribution, Parameters } from "@/lib/types"
import FormNormalDistribution from "./form-normal-distribution"
import { Dispatch, SetStateAction } from "react"
import FormLognormalDistribution from "./form-lognormal-distribution"
import FormUniformDistribution from "./form-uniform-distribution"
import FormBetaDistribution from "./form-beta-distribution"
import FormPertDistribution from "./form-pert-distribution"
import FormMetalogDistribution from "./form-metalog-distribution"

type DistributionParamsProps = {
  distribution: Distribution
  setParams: Dispatch<SetStateAction<Parameters>>
}

const DistributionParams = ({
  distribution,
  setParams,
}: DistributionParamsProps) => {
  switch (distribution) {
    case "normal":
      return <FormNormalDistribution setParams={setParams} />
    case "lognormal":
      return <FormLognormalDistribution setParams={setParams} />
    case "uniform":
      return <FormUniformDistribution setParams={setParams} />
    case "beta":
      return <FormBetaDistribution setParams={setParams} />
    case "pert":
      return <FormPertDistribution setParams={setParams} />
    case "metalog":
      return <FormMetalogDistribution setParams={setParams} />
    default:
      return null
  }
}

export default DistributionParams
