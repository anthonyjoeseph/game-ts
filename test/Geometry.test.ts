import { pipe } from 'fp-ts/function'
import * as S from 'graphics-ts/lib/Shape'
import * as G from 'geometric'
import * as assert from 'assert'
import {
  toPointArray,
  toPointRecord,
  toRect,
  toVerticies,
  collisions,
  PointArray,
  RectVerticies,
} from '../src/Geometry'

describe('Geometry', () => {
  describe('Point Conversions', () => {
    const p1: S.Point = S.point(0, 1)
    const p2: PointArray = [0, 1]

    it('toPointArray', () => {
      assert.deepStrictEqual(toPointArray(p1), p2)
    })

    it('toPointRecord', () => {
      assert.deepStrictEqual(toPointRecord(p2), p1)
    })
  })

  describe('Rect Conversions', () => {
    const r1: S.Rect = S.rect(0, 0, 4, 4)
    const r2: RectVerticies = [
      [0, 0],
      [4, 0],
      [4, 4],
      [0, 4],
    ]

    it('toVerticies', () => {
      assert.deepStrictEqual(toVerticies(r1), r2)
    })

    it('toRect', () => {
      assert.deepStrictEqual(toRect(r2), r1)
    })
  })

  describe('readonlyCollisions & collisions', () => {
    const intersect = (a: S.Rect) => (b: S.Rect) =>
      G.polygonIntersectsPolygon(toVerticies(a), toVerticies(b))
    it('returns correct collisions', () => {
      const r1 = S.rect(0, 0, 4, 4)
      const r2 = S.rect(0, 0, 2, 2)
      const r3 = S.rect(3, 3, 2, 2)
      const r4 = S.rect(0, 5, 2, 2)
      assert.deepStrictEqual(pipe([r1, r2, r3, r4], collisions(intersect)), [
        [r1, r2],
        [r1, r3],
      ])
    })

    it('returns empty for no collisions', () => {
      const r1 = S.rect(0, 0, 4, 4)
      const r4 = S.rect(0, 5, 2, 2)
      assert.deepStrictEqual(pipe([r1, r4], collisions(intersect)), [])
    })
  })
})
