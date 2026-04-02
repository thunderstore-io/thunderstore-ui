export function setParamsBlobValue<
  SearchParamsType,
  K extends keyof SearchParamsType,
>(setter: React.Dispatch<React.SetStateAction<SearchParamsType>>, key: K) {
  return (v: SearchParamsType[K]) =>
    setter((prevBlob) => ({ ...prevBlob, [key]: v }));
}

// Keep the old signature wrapper with `oldBlob` around for backward compatibility,
// although it should be refactored eventually.
export function setParamsBlobValueLegacy<
  SearchParamsType,
  K extends keyof SearchParamsType,
>(setter: (v: SearchParamsType) => void, oldBlob: SearchParamsType, key: K) {
  return (v: SearchParamsType[K]) => setter({ ...oldBlob, [key]: v });
}
