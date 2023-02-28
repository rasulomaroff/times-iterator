type ExitFunction = () => void

class TimesIterator {
  public constructor(private readonly number: number) {
    if (number <= 0) throw new Error('Number must be greater than 0')
  }

  public do(fn: (number: number, index: number, exit: ExitFunction) => void, reverse?: boolean): this {
    this.for(this.number, (i, exit) => fn(i + 1, i, exit), reverse)

    return this
  }

  public reverseDo(fn: (number: number, index: number, exit: ExitFunction) => void): this {
    return this.do(fn, true)
  }

  public reduce<T>(fn: (acc: T, number: number, index: number, exit: ExitFunction) => T, acc: T, reverse?: boolean): T {
    this.for(this.number, (i, exit) => (acc = fn(acc, i + 1, i, exit)), reverse)

    return acc
  }

  public reverseReduce<T>(fn: (acc: T, number: number, index: number, exit: ExitFunction) => T, acc: T): T {
    return this.reduce(fn, acc, true)
  }

  public map<T>(fn: (number: number, index: number, arr: unknown[], exit: ExitFunction) => T, reverse?: boolean): T[] {
    const result: T[] = []
    this.for(this.number, (i, exit) => result.push(fn(i + 1, i, result, exit)), reverse)

    return result
  }

  public reverseMap<T>(fn: (number: number, index: number, arr: unknown[], exit: ExitFunction) => T): T[] {
    return this.map(fn, true)
  }

  public select(
    fn: (number: number, index: number, arr: number[], exit: ExitFunction) => boolean,
    reverse?: boolean
  ): number[] {
    const result: number[] = []
    this.for(this.number, (i, exit) => fn(i + 1, i, result, exit) && result.push(i + 1), reverse)

    return result
  }

  public reverseSelect(fn: (number: number, index: number, arr: number[], exit: ExitFunction) => boolean): number[] {
    return this.select(fn, true)
  }

  public takeWhile(
    fn: (number: number, index: number, arr: number[], exit: ExitFunction) => boolean,
    reverse?: boolean
  ): number[] {
    const result: number[] = []
    this.for(this.number, (i, exit) => (fn(i + 1, i, result, exit) ? result.push(i + 1) : exit()), reverse)

    return result
  }

  public reverseTakeWhile(fn: (number: number, index: number, arr: number[], exit: ExitFunction) => boolean): number[] {
    return this.takeWhile(fn, true)
  }

  public takeUntil(
    fn: (number: number, index: number, arr: number[], exit: ExitFunction) => boolean,
    reverse?: boolean
  ): number[] {
    const inverseFn = (n: number, i: number, arr: number[], exit: ExitFunction): boolean => !fn(n, i, arr, exit)
    return this.takeWhile(inverseFn, reverse)
  }

  public reverseTakeUntil(fn: (number: number, index: number, arr: number[], exit: ExitFunction) => boolean): number[] {
    return this.takeUntil(fn, true)
  }

  private for(length: number, fn: (index: number, exit: ExitFunction) => void, reverse?: boolean): void {
    let exited = false
    const exit = (): void => void (exited = true)

    for (let i = reverse ? length - 1 : 0; reverse ? i >= 0 : i < length; reverse ? i-- : i++) {
      fn(i, exit)
      if (exited) break
    }
  }
}

type TimesFunction = {
  (n: number, doFn: (number: number, index: number, exit: ExitFunction) => void): void
  (n: number): TimesIterator
}

export const times: TimesFunction = (n: number, doFn?: (number: number, index: number, exit: ExitFunction) => void) => {
  if (doFn) {
    new TimesIterator(n).do(doFn)
    return
  }

  return new TimesIterator(n)
}
