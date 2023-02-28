# times-iterator
This package is inspired by the syntax of the Ruby programming language and lets you iterate over a number of times and do something with it.

## Installation
### npm
```bash
npm install times-iterator
```

### yarn
```bash
yarn add times-iterator
```

## API
**The argument that you pass to the `times` function must be greater than 0**

`do` - this method always returns the instance of the "times" function, so you can chain it
```ts
  let n = 0
  // will be called 20 times
  times(20).do((number, index, exitFn) => n++)
  // n = 20

  let k = 0
  // will also be called 20 times
  times(10)
     .do((number, index, exitFn) => k++)
     .do((number, index, exitFn) => k++)
  // k = 20
```

`map`
```ts
  const arr = times(10).map((number, index, arr, exitFn) => number * 2)
  // arr = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20]
```

`reduce`
```ts
  const sum = times(10).reduce((acc, number, index, exitFn) => acc + number, 0)
  // sum = 55
```

`filter` or `select`
```ts
  const arr = times(10).filter((number, index, arr, exitFn) => number % 2 === 0)
  // arr = [2, 4, 6, 8, 10]

  const anotherArr = times(10).select((number, index, arr, exitFn) => number % 2 === 0)
  // anotherArr = [2, 4, 6, 8, 10]
```

`takeWhile` - takes while the condition is true
```ts
  const arr = times(10).takeWhile((number, index, arr, exitFn) => number < 5)
  // arr = [1, 2, 3, 4]
```

`takeUntil` - takes till the condition becomes true
```ts
  const arr = times(10).takeUntil((number, index, arr, exitFn) => number === 5)
  // arr = [1, 2, 3, 4]
```

### Reverse
Every method has a reverse version, for example: `reverseDo`, `reverseMap`, `reverseReduce`, `reverseFilter`, `reverseSelect`, `reverseTakeWhile`, `reverseTakeUntil`

```ts
  let n = 0
  // will be called 20 times
  times(20).reverseDo((number, index, exitFn) => n++)
  // n = 20

  let k = 0
  // will also be called 20 times
  times(10)
     .reverseDo((number, index, exitFn) => k++)
     .reverseDo((number, index, exitFn) => k++)
  // k = 20
```

You can also go reverse by passing a second argument as true to any function you use

```ts
  let n = 0
  // will be called 20 times
  times(20).do((number, index, exitFn) => n++, true)
  // n = 20
    
  let k = 0
  // will also be called 20 times
  times(10)
    .do((number, index, exitFn) => k++, true)
    .do((number, index, exitFn) => k++, true)
    // k = 20
```

### Exit

You can exit the loop by calling the `exit` function

```ts
  let n = 0
  // will be called 20 times
  times(20).do((number, index, exit) => {
    n++
    if (n === 10) exit()
  })
  // n = 10
```

It gives you the possibility to create infinite loops since you can pass `Infinity` as the first argument

```ts
  let n = 0
  times(Infinity).do((number, index, exit) => {
    n++
    if (n === 10) exit()
  })
  // n = 10
```

##### _Exit function is available in all the methods so you can quit the loop at any time you want!_

## Usage
```ts
import { times } from 'times-iterator'

const evenNumbersTill100 = times(100).select(number => number % 2 === 0)
```

### React
```tsx
import React from 'react'
import { times } from 'times-iterator'

const Dots = props => {
  return (
    <div class={'flex items-center space-x-10'}>
      {times(props.dotsNumber).map(n => <div key={n} className={'w-4 h-4 rounded-full'} />)}
    </div>
  )
}
```
