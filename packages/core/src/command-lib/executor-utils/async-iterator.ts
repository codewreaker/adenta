/**
 * Borrowed from https://github.com/nrwl/nx/blob/27cfc7efa1188cf9273b4c7d3ca2715a48c31f98/packages/nx/src/utils/async-iterator.ts#L5
 */

export function isAsyncIterator<T>(v: any): v is AsyncIterableIterator<T> {
  return typeof v?.[Symbol.asyncIterator] === 'function';
}

async function getLastValueFromAsyncIterableIterator<T>(
  i: AsyncIterable<T> | AsyncIterableIterator<T>
): Promise<T> {
  let prev: IteratorResult<T, T>;
  let current: IteratorResult<T, T>;
    //@ts-expect-error copied exactly from source
  const generator = i[Symbol.asyncIterator] || i[Symbol.iterator];
  const iterator = generator.call(i);

  do {
    //@ts-expect-error copied directly from source
    prev = current;
    current = await iterator.next();
  } while (!current.done);

  return current.value !== undefined || !prev ? current.value : prev.value;
}

export async function iteratorToProcessStatusCode(
  i: AsyncIterableIterator<{ success: boolean }>
): Promise<number> {
  const { success } = await getLastValueFromAsyncIterableIterator(i);
  return success ? 0 : 1;
}