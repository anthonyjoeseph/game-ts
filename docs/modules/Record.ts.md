---
title: Record.ts
nav_order: 12
parent: Modules
---

## Record overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [invertAll](#invertall)
  - [invertLast](#invertlast)
  - [lookupFlipped](#lookupflipped)
  - [merge](#merge)
  - [omit](#omit)
  - [pick](#pick)
  - [reject](#reject)
  - [values](#values)

---

# utils

## invertAll

Invert a record, collecting values with duplicate keys in an array. Should
you only care about the last item or are not worried about the risk of
duplicate keys, see instead `invertLast`.

**Signature**

```ts
export declare const invertAll: <A>(f: (x: A) => string) => (x: Record<string, A>) => Record<string, string[]>
```

**Example**

```ts
import { invertAll } from 'fp-ts-std/Record'
import { fromNumber } from 'fp-ts-std/String'

assert.deepStrictEqual(invertAll(fromNumber)({ a: 1, b: 2, c: 2, d: 3 }), { '1': ['a'], '2': ['b', 'c'], '3': ['d'] })
```

Added in v0.7.0

## invertLast

Invert a record, keeping only the last value should the same key be
encountered more than once. If you'd like to keep the values that would be
lost, see instead `invertAll`.

**Signature**

```ts
export declare const invertLast: <A>(f: (x: A) => string) => (x: Record<string, A>) => Record<string, string>
```

**Example**

```ts
import { invertLast } from 'fp-ts-std/Record'
import { fromNumber } from 'fp-ts-std/String'

assert.deepStrictEqual(invertLast(fromNumber)({ a: 1, b: 2, c: 2, d: 3 }), { '1': 'a', '2': 'c', '3': 'd' })
```

Added in v0.7.0

## lookupFlipped

Like `lookup` from fp-ts, but flipped.

**Signature**

```ts
export declare const lookupFlipped: <A>(x: Record<string, A>) => (k: string) => Option<A>
```

**Example**

```ts
import { lookupFlipped } from 'fp-ts-std/Record'
import * as A from 'fp-ts/Array'

const x = { a: 1, b: 'two', c: [true] }
const ks = ['a', 'c']

assert.deepStrictEqual(A.filterMap(lookupFlipped(x))(ks), [1, [true]])
```

Added in v0.1.0

## merge

Merge two records together. For merging many identical records, instead
consider defining a semigroup.

**Signature**

```ts
export declare const merge: <A>(x: A) => <B>(y: B) => A & B
```

**Example**

```ts
import { merge } from 'fp-ts-std/Record'

assert.deepStrictEqual(merge({ a: 1, b: 2 })({ b: 'two', c: true }), { a: 1, b: 'two', c: true })
```

Added in v0.7.0

## omit

Omit a set of keys from a `Record`. The value-level equivalent of the `Omit`
type.

**Signature**

```ts
export declare const omit: <K extends string>(
  ks: K[]
) => <V, A extends Record<K, V>>(x: Partial<A>) => Pick<A, Exclude<keyof A, K>>
```

**Example**

```ts
import { omit } from 'fp-ts-std/Record'

const sansB = omit(['b'])

assert.deepStrictEqual(sansB({ a: 1, b: 'two', c: [true] }), { a: 1, c: [true] })
```

Added in v0.1.0

## pick

Pick a set of keys from a `Record`. The value-level equivalent of the `Pick`
type.

**Signature**

```ts
export declare const pick: <A>() => <K extends keyof A>(ks: K[]) => (x: A) => Pick<A, K>
```

**Example**

```ts
import { pick } from 'fp-ts-std/Record'

type MyType = { a: number; b: string; c: Array<boolean> }
const picked = pick<MyType>()(['a', 'c'])

assert.deepStrictEqual(picked({ a: 1, b: 'two', c: [true] }), { a: 1, c: [true] })
```

Added in v0.1.0

## reject

Filters out key/value pairs in the record for which the predicate upon the
value holds. This can be thought of as the inverse of ordinary record
filtering.

**Signature**

```ts
export declare const reject: <A>(f: Predicate<A>) => Endomorphism<Record<string, A>>
```

**Example**

```ts
import { reject } from 'fp-ts-std/Record'
import { Predicate } from 'fp-ts/function'

const isEven: Predicate<number> = (n) => n % 2 === 0

assert.deepStrictEqual(reject(isEven)({ a: 1, b: 2, c: 3, d: 4 }), { a: 1, c: 3 })
```

Added in v0.7.0

## values

Get the values from a `Record`.

**Signature**

```ts
export declare const values: <A>(x: Record<string, A>) => A[]
```

**Example**

```ts
import { values } from 'fp-ts-std/Record'

const x = { a: 1, b: 'two' }

assert.deepStrictEqual(values(x), [1, 'two'])
```

Added in v0.1.0
