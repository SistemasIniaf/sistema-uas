export function transformBoolean(
  obj: Record<string, unknown>,
  key: string,
): boolean | undefined {
  const raw = obj[key];
  if (raw === undefined || raw === null || raw === '') return undefined;
  if (raw === 'true' || raw === true) return true;
  if (raw === 'false' || raw === false) return false;
  return undefined;
}
