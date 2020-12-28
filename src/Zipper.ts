import { pipe } from 'fp-ts/pipeable'
import * as O from 'fp-ts/Option'
import * as Z from 'fp-ts-contrib/lib/Zipper'

export const copyFocus = <A, B>(source: Z.Zipper<A>) => (dest: Z.Zipper<B>) =>
  pipe(
    Z.move(() => source.lefts.length, dest),
    O.getOrElse(() => dest),
  )

export const loopingAdvance = <A>(z: Z.Zipper<A>): Z.Zipper<A> =>
  pipe(
    z,
    Z.down,
    O.getOrElse(() => Z.start(z)),
  )
