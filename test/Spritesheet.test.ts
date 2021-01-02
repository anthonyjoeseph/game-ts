import * as assert from 'assert'
import * as E from 'fp-ts/Either'
import * as S from 'graphics-ts/lib/Shape'
import {
  toGraphicsRect,
  toSpriteRect,
  DimensionsCodec,
  FrameRecordCodec,
  FrameArrayCodec,
  Rect,
} from '../src/Spritesheet'
import * as frameArray from './resources/frameArray.json'
import * as frameRecord from './resources/frameRecord.json'

describe('Spritesheet', () => {
  const graphicsRect: S.Rect = S.rect(0, 0, 4, 4)
  const spriteRect: Rect = { x: 0, y: 0, w: 4, h: 4 }
  it('toGraphicsRect', () => {
    assert.deepStrictEqual(toGraphicsRect(spriteRect), graphicsRect)
  })

  it('toSpriteRect', () => {
    assert.deepStrictEqual(toSpriteRect(graphicsRect), spriteRect)
  })

  describe('DimensionsCodec', () => {
    it('succeeds when good', () => {
      const goodDimensions = { w: 4, h: 4 }
      assert.deepStrictEqual(E.isRight(DimensionsCodec.decode(goodDimensions)), true)
    })
    it('fails when bad', () => {
      const badDimensions = { w: 4 }
      assert.deepStrictEqual(E.isLeft(DimensionsCodec.decode(badDimensions)), true)
    })
  })

  describe('FrameRecordCodec', () => {
    it('succeeds when good', () => {
      assert.deepStrictEqual(E.isRight(FrameRecordCodec.decode(frameRecord)), true)
    })
    it('fails when bad', () => {
      const badFrameRecord = { bad: true }
      assert.deepStrictEqual(E.isLeft(FrameRecordCodec.decode(badFrameRecord)), true)
    })
  })

  describe('FrameArrayCodec', () => {
    it('succeeds when good', () => {
      assert.deepStrictEqual(E.isRight(FrameArrayCodec.decode(frameArray)), true)
    })
    it('fails when bad', () => {
      const badFrameArray = { bad: true }
      assert.deepStrictEqual(E.isLeft(FrameArrayCodec.decode(badFrameArray)), true)
    })
  })
})
