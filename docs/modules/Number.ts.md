---
title: Number.ts
nav_order: 10
parent: Modules
---

## Number overview

Added in v0.1.0

---

<h2 class="text-delta">Table of contents</h2>

- [utils](#utils)
  - [add](#add)
  - [decrement](#decrement)
  - [divide](#divide)
  - [increment](#increment)
  - [isValid](#isvalid)
  - [mod](#mod)
  - [multiply](#multiply)
  - [negate](#negate)
  - [rem](#rem)
  - [subtract](#subtract)

---

# utils

## add

Add two numbers together.

**Signature**

```ts
export declare const add: (x: number) => Endomorphism<number>
```

**Example**

```ts
import { add } from 'fp-ts-std/Number'

assert.strictEqual(add(2)(3), 5)
```

Added in v0.1.0

## decrement

Decrement a number.

**Signature**

```ts
export declare const decrement: Endomorphism<number>
```

**Example**

```ts
import { decrement } from 'fp-ts-std/Number'

assert.strictEqual(decrement(3), 2)
```

Added in v0.1.0

## divide

Divide the second number (the _dividend_) by the first number (the
_divisor_).

**Signature**

```ts
export declare const divide: (divisor: number) => Endomorphism<number>
```

**Example**

```ts
import { divide } from 'fp-ts-std/Number'

assert.strictEqual(divide(2)(4), 2)
assert.strictEqual(divide(4)(2), 0.5)
```

Added in v0.2.0

## increment

Increment a number.

**Signature**

```ts
export declare const increment: Endomorphism<number>
```

**Example**

```ts
import { increment } from 'fp-ts-std/Number'

assert.strictEqual(increment(3), 4)
```

Added in v0.1.0

## isValid

Check if a number is actually valid. Specifically, all this function is
doing is checking whether or not the number is `NaN`.

**Signature**

```ts
export declare const isValid: Predicate<number>
```

**Example**

```ts
import { isValid } from 'fp-ts-std/Number'

const valid = 123
const invalid = NaN

assert.strictEqual(isValid(valid), true)
assert.strictEqual(isValid(invalid), false)
```

Added in v0.7.0

## mod

Calculate the modulus. See also `rem`.

**Signature**

```ts
export declare const mod: (divisor: number) => Endomorphism<number>
```

**Example**

```ts
import { mod } from 'fp-ts-std/Number'

assert.strictEqual(mod(2)(5.5), 1.5)
assert.strictEqual(mod(-4)(2), -2)
assert.strictEqual(mod(5)(-12), 3)
```

Added in v0.7.0

## multiply

Multiply two numbers together.

**Signature**

```ts
export declare const multiply: (x: number) => Endomorphism<number>
```

**Example**

```ts
import { multiply } from 'fp-ts-std/Number'

assert.strictEqual(multiply(2)(3), 6)
```

Added in v0.2.0

## negate

Unary negation.

**Signature**

```ts
export declare const negate: Endomorphism<number>
```

**Example**

```ts
import { negate } from 'fp-ts-std/Number'

assert.strictEqual(negate(42), -42)
assert.strictEqual(negate(-42), 42)
```

Added in v0.7.0

## rem

Calculates the remainder. See also `mod`.

**Signature**

```ts
export declare const rem: (divisor: number) => Endomorphism<number>
```

**Example**

```ts
import { rem } from 'fp-ts-std/Number'

assert.strictEqual(rem(2)(5.5), 1.5)
assert.strictEqual(rem(-4)(2), 2)
assert.strictEqual(rem(5)(-12), -2)
```

Added in v0.7.0

## subtract

Subtract the first number (the _subtrahend_) from the second number (the
_minuend_).

**Signature**

```ts
export declare const subtract: (subtrahend: number) => Endomorphism<number>
```

**Example**

```ts
import { subtract } from 'fp-ts-std/Number'

assert.strictEqual(subtract(2)(3), 1)
assert.strictEqual(subtract(3)(2), -1)
```

Added in v0.2.0
