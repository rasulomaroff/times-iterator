import { times } from 'times-iterator'
import { afterEach, describe, expect, it, vi } from 'vitest'

const fn = vi.fn()

afterEach(() => {
  fn.mockClear()
})

describe('times', () => {
  it('should iterate n times', () => {
    times(5).do(fn).do(fn).do(fn).map(fn)

    expect(fn).toBeCalledTimes(20)
  })

  it('should work correctly with Infinity', () => {
    let i = 0
    times(Infinity).do((_, __, exit) => {
      i++
      if (i === 100) exit()
    })

    expect(i).toBe(100)
  })

  it('second parameter should work', () => {
    times(5, fn)
    expect(fn).toBeCalledTimes(5)
  })

  it('should iterate n times in reverse', () => {
    times(5).reverseDo(fn).reverseDo(fn).reverseDo(fn).reverseMap(fn)
    expect(fn).toBeCalledTimes(20)

    let i = 5

    times(5).reverseDo(number => {
      expect(number).toBe(i)
      i--
    })
  })

  it('should return an array of n elements', () => {
    const emptyResult = times(5).map(fn)
    const numberResult = times(5).map(i => i)

    expect(emptyResult).toHaveLength(5)
    expect(fn).toBeCalledTimes(5)
    expect(numberResult).toEqual([1, 2, 3, 4, 5])
  })

  it('should return an array of n elements in reverse', () => {
    const emptyResult = times(5).reverseMap(fn)
    const numberResult = times(5).reverseMap(i => i * 2)

    expect(emptyResult).toHaveLength(5)
    expect(fn).toBeCalledTimes(5)
    expect(numberResult).toEqual([10, 8, 6, 4, 2])
  })

  it('should reduce n times', () => {
    const result = times(5).reduce((acc, number) => {
      fn()
      return acc + number
    }, 0)

    expect(fn).toBeCalledTimes(5)
    expect(result).toBe(15)
  })

  it('should reduce n times in reverse', () => {
    let i = 5
    const result = times(5).reverseReduce((acc, number) => {
      expect(number).toBe(i)
      i--
      fn()
      return acc + number
    }, 0)

    expect(fn).toBeCalledTimes(5)
    expect(result).toBe(15)
  })

  it('should take a value if the function returns true', () => {
    const result = times(5).select(number => number % 2 === 0)
    expect(result).toStrictEqual([2, 4])
  })

  it('should take a value if the function returns true in reverse', () => {
    const result = times(5).reverseSelect(number => number % 2 === 0)
    expect(result).toStrictEqual([4, 2])
  })

  it('should take values while the condition is true in reverse', () => {
    const result = times(5).reverseTakeWhile(number => number > 3)
    expect(result).toStrictEqual([5, 4])
  })

  it('should take values while the condition is true', () => {
    const result = times(Infinity).takeWhile(number => number < 3)
    expect(result).toStrictEqual([1, 2])
  })

  it('should stop taking values if the condition is false', () => {
    const result = times(Infinity).takeUntil(number => number === 3)
    expect(result).toStrictEqual([1, 2])
  })

  it('should stop taking values if the condition is false in reverse', () => {
    const result = times(5).reverseTakeUntil(number => number < 3)
    expect(result).toStrictEqual([5, 4, 3])
  })

  it('should exit if the "exit" method is called in the "do" method', () => {
    times(5).do((n, _, exit) => {
      fn()
      n === 3 && exit()
    })

    expect(fn).toBeCalledTimes(3)
  })

  it('should exit if the "exit" method is called in the "reverseDo" method', () => {
    times(5).reverseDo((n, _, exit) => {
      fn()
      5 - n === 1 && exit()
    })
    expect(fn).toBeCalledTimes(2)
  })

  it('should exit if the "exit" method is called in the "reduce" method', () => {
    times(5).reduce((acc, n, _, exit) => {
      fn()
      n === 3 && exit()
      return acc + n
    }, 20)
    expect(fn).toBeCalledTimes(3)
  })

  it('should exit if the "exit" method is called in the "reverseReduce" method', () => {
    times(5).reverseReduce((acc, n, _, exit) => {
      fn()
      5 - n === 3 && exit()
      return acc + n
    }, 20)
    expect(fn).toBeCalledTimes(4)
  })

  it('should exit if the "exit" method is called in the "map" method', () => {
    times(5).map((n, _, __, exit) => {
      fn()
      n === 3 && exit()
      return n
    })
    expect(fn).toBeCalledTimes(3)
  })

  it('should exit if the "exit" method is called in the "reverseMap" method', () => {
    times(5).reverseMap((n, _, __, exit) => {
      fn()
      5 - n === 2 && exit()
      return n
    })
    expect(fn).toBeCalledTimes(3)
  })

  it('should exit if the "exit" method is called in the "select" method', () => {
    times(10).select((number, _, __, exit) => {
      fn()
      number === 7 && exit()
      return true
    })
    expect(fn).toBeCalledTimes(7)
  })

  it('should exit if the "exit" method is called in the "reverseSelect" method', () => {
    times(12).reverseSelect((number, _, __, exit) => {
      fn()
      number === 7 && exit()
      return true
    })

    expect(fn).toBeCalledTimes(6)
  })

  it('should exit if the "exit" method is called in the "takeWhile" method', () => {
    times(10).takeWhile((number, _, __, exit) => {
      fn()
      number === 7 && exit()
      return true
    })

    expect(fn).toBeCalledTimes(7)
  })

  it('should exit if the "exit" method is called in the "reverseTakeWhile" method', () => {
    times(12).reverseTakeWhile((number, _, __, exit) => {
      fn()
      number === 7 && exit()
      return true
    })

    expect(fn).toBeCalledTimes(6)
  })

  it('should exit if the "exit" method is called in the "takeUntil" method', () => {
    times(10).takeUntil((number, _, __, exit) => {
      fn()
      number === 7 && exit()
      return false
    })

    expect(fn).toBeCalledTimes(7)
  })

  it('should exit if the "exit" method is called in the "reverseTakeUntil" method', () => {
    times(12).reverseTakeUntil((number, _, __, exit) => {
      fn()
      number === 7 && exit()
      return false
    })

    expect(fn).toBeCalledTimes(6)
  })
})
