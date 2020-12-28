import { pipe, Predicate } from 'fp-ts/function'
import * as S from 'graphics-ts/lib/Shape'
import * as RA from 'fp-ts/ReadonlyArray'

export type PointArray = [number, number]
export type RectVerticies = [PointArray, PointArray, PointArray, PointArray]

export const toPointArray = (r: S.Point): PointArray => [r.x, r.y]
export const toPointRecord = (a: PointArray): S.Point => ({ x: a[0], y: a[1] })

export const toVerticies = (r: S.Rect): RectVerticies => [
  [r.x, r.y],
  [r.x + r.width, r.y],
  [r.x + r.width, r.y + r.height],
  [r.x, r.y + r.height],
]
export const toRect = (v: RectVerticies): S.Rect =>
  S.rect(v[0][0], v[0][1], v[2][0] - v[0][0], v[2][1] - v[0][1])

export const readonlyCollisions = <A>(compare: (a: A) => Predicate<A>) => (
  as: ReadonlyArray<A>,
): ReadonlyArray<[A, A]> =>
  pipe(
    as,
    RA.chainWithIndex((index, a) =>
      pipe(
        as,
        RA.dropLeft(index + 1),
        RA.filter<A>(compare(a)),
        RA.map((b): [A, A] => [a, b]),
      ),
    ),
  )

export const collisions: <A>(
  compare: (a: A) => Predicate<A>,
) => (as: Array<A>) => Array<[A, A]> = readonlyCollisions as never
