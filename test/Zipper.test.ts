import { pipe } from 'fp-ts/pipeable'
import * as NEA from 'fp-ts/NonEmptyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import * as Z from 'fp-ts-contrib/lib/Zipper'
import * as assert from 'assert'
import { copyFocus, loopingAdvance } from '../src/Zipper'

const testZipper: Z.Zipper<number> = Z.fromNonEmptyArray(
  RNEA.concat(RNEA.of(0), [1]) as NEA.NonEmptyArray<number>,
)

describe('Zipper Utils', () => {
  describe('loopingAdvance', () => {
    it('advances the focus', () => {
      const newZipper = loopingAdvance(testZipper)
      assert.deepStrictEqual(newZipper.lefts.length, 1)
    })
    it('loops at the end', () => {
      const loopedZipper = pipe(testZipper, loopingAdvance, loopingAdvance)
      assert.deepStrictEqual(loopedZipper.lefts.length, 0)
    })
  })
  describe('copyFocus', () => {
    const longerZipper = Z.fromNonEmptyArray(
      RNEA.concat(RNEA.of(0), [1, 2]) as NEA.NonEmptyArray<number>,
    )
    it('copies the focus', () => {
      const loopedLongerZipper = loopingAdvance(longerZipper)
      const copiedTestZipper = copyFocus(loopedLongerZipper)(testZipper)
      assert.deepStrictEqual(copiedTestZipper.lefts.length, 1)
    })
    it('does nothing if the focus doesnt exist', () => {
      const loopedLongerZipper = pipe(longerZipper, loopingAdvance, loopingAdvance)
      const copiedTestZipper = copyFocus(loopedLongerZipper)(testZipper)
      assert.deepStrictEqual(copiedTestZipper.lefts.length, 0)
    })
  })
})
