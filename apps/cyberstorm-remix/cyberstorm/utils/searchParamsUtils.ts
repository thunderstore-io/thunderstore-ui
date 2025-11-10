export function setParamsBlobValue<
  SearchParamsType,
  K extends keyof SearchParamsType,
>(setter: (v: SearchParamsType) => void, oldBlob: SearchParamsType, key: K) {
  return (v: SearchParamsType[K]) => setter({ ...oldBlob, [key]: v });
}

export function parseIntegerSearchParam(value: string | null) {
  if (value === null) {
    return undefined;
  }
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed) || !Number.isSafeInteger(parsed)) {
    return undefined;
  }
  return parsed;
}
