export const assertPositive = (x: number): void => {
  if (x <= 0) {
    throw new Error(`Expected positive number but got ${x}`)
  }
}

export const assertPositiveInteger = (x: number): void => {
  if (x <= 0 || !Number.isInteger(x)) {
    throw new Error(`Expected positive integer number but got ${x}`)
  }
}
