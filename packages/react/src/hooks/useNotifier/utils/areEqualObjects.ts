export const areEqualObjects = <T1 extends object, T2 extends object>(
  obj1: T1,
  obj2: T2,
): boolean => {
  const keys1 = Object.keys(obj1) as unknown as (keyof T1)[];
  const keys2 = Object.keys(obj2) as unknown as (keyof T2)[];

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = obj1[key];
    // @ts-expect-error ts(2536) we assume that `obj1` and `obj2` has the same keys
    const val2 = obj2[key];

    if (val1 !== val2) {
      return false;
    }
  }

  return true;
};
