import * as S from 'graphics-ts/lib/Shape'
import * as assert from 'assert'
import {
  intersect,
  overlap,
  contains,
  containsWithin,
  collisions,
  readonlyCollisions,
} from '../src/Collision'

describe('Collisions', () => {
  describe('intersect', () => {
    it('intersecting is true', () => {
      const r1 = S.rect(0, 0, 2, 2)
      const r2 = S.rect(1, 1, 2, 2)
      assert.deepStrictEqual(intersect(r1)(r2), true)
    })

    it('containing is true', () => {
      const r1 = S.rect(0, 0, 4, 4)
      const r2 = S.rect(1, 1, 2, 2)
      assert.deepStrictEqual(intersect(r1)(r2), true)
    })

    it('apart is false', () => {
      const r1 = S.rect(0, 0, 2, 2)
      const r2 = S.rect(0, 3, 2, 2)
      assert.deepStrictEqual(intersect(r1)(r2), false)
    })

    it('bordering is true', () => {
      const r1 = S.rect(0, 0, 2, 2)
      const r2 = S.rect(0, 2, 2, 2)
      assert.deepStrictEqual(intersect(r1)(r2), true)
    })
  })

  describe('overlap', () => {
    it('intersecting is true', () => {
      const r1 = S.rect(0, 0, 2, 2)
      const r2 = S.rect(1, 1, 2, 2)
      assert.deepStrictEqual(overlap(r1)(r2), true)
    })

    it('bordering is false', () => {
      const r1 = S.rect(0, 0, 2, 2)
      const r2 = S.rect(0, 2, 2, 2)
      assert.deepStrictEqual(overlap(r1)(r2), false)
    })
  })

  describe('contains', () => {
    it('containing is true', () => {
      const r1 = S.rect(0, 0, 4, 4)
      const r2 = S.rect(1, 1, 2, 2)
      assert.deepStrictEqual(contains(r1)(r2), true)
    })

    it('not containing is false', () => {
      const r1 = S.rect(0, 0, 4, 4)
      const r2 = S.rect(0, 5, 2, 2)
      assert.deepStrictEqual(contains(r1)(r2), false)
    })

    it('true on equivalent edges', () => {
      const r1 = S.rect(0, 0, 4, 4)
      const r2 = S.rect(0, 0, 2, 2)
      assert.deepStrictEqual(contains(r1)(r2), true)
    })
  })

  describe('containsWithin', () => {
    it('containing is true', () => {
      const r1 = S.rect(0, 0, 4, 4)
      const r2 = S.rect(1, 1, 2, 2)
      assert.deepStrictEqual(containsWithin(r1)(r2), true)
    })

    it('false on equivalent edges', () => {
      const r1 = S.rect(0, 0, 4, 4)
      const r2 = S.rect(0, 0, 2, 2)
      assert.deepStrictEqual(containsWithin(r1)(r2), false)
    })
  })

  describe('readonlyCollisions & collisions', () => {
    it('returns correct collisions', () => {
      const r1 = S.rect(0, 0, 4, 4)
      const r2 = S.rect(0, 0, 2, 2)
      const r3 = S.rect(3, 3, 2, 2)
      const r4 = S.rect(0, 5, 2, 2)
      assert.deepStrictEqual(readonlyCollisions(intersect)([r1, r2, r3, r4]), [
        [r1, r2],
        [r1, r3],
      ])
      assert.deepStrictEqual(collisions(intersect)([r1, r2, r3, r4]), [
        [r1, r2],
        [r1, r3],
      ])
    })

    it('returns empty for no collisions', () => {
      const r1 = S.rect(0, 0, 4, 4)
      const r4 = S.rect(0, 5, 2, 2)
      assert.deepStrictEqual(readonlyCollisions(intersect)([r1, r4]), [])
      assert.deepStrictEqual(collisions(intersect)([r1, r4]), [])
    })
  })
})
