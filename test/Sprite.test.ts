import { pipe } from 'fp-ts/pipeable'
import * as E from 'fp-ts/Either'
import * as Z from 'fp-ts-contrib/lib/Zipper'
import * as IO from 'fp-ts/IO'
import * as S from 'graphics-ts/lib/Shape'
import * as C from 'graphics-ts/lib/Canvas'
import * as assert from 'assert'
import { assertCalledWith } from './utils'
import {
  Sprite,
  SpriteFrame,
  animate,
  fetchImageElement,
  drawImageOffset,
  drawSprite,
} from '../src/Sprite'

// graphics-ts setup

const CANVAS_ID = 'canvas'
const TEST_CANVAS_ID = 'test-canvas'
const FOCUS_TARGET = 'focus-target'
const CANVAS_WIDTH = 400
const CANVAS_HEIGHT = 600

let canvas: HTMLCanvasElement
let focusTarget: HTMLElement
let ctx: CanvasRenderingContext2D
let testCtx: CanvasRenderingContext2D

const render: <A>(fa: C.Render<A>) => IO.IO<A> = (fa) =>
  pipe(canvas, C.getContext2D, IO.chain(fa))

// game-ts setup

export const MILLIS_PER_FRAME = 200

const frameForIndex = (x: number): SpriteFrame => ({
  rect: S.rect(16 * x, 0, 16, 18),
  duration: MILLIS_PER_FRAME,
})
export const spriteFrames: Z.Zipper<SpriteFrame> = Z.fromNonEmptyArray<SpriteFrame>([
  frameForIndex(0),
  frameForIndex(1),
  frameForIndex(0),
  frameForIndex(2),
])

const image = new Image()
image.src = 'https://opengameart.org/sites/default/files/Green-Cap-Character-16x18.png'
image.height = 220
image.width = 440

const testSprite: Sprite = {
  animationDelta: 0,
  frames: spriteFrames,
  rect: S.rect(0, 0, 50, 56),
  src: image,
}

describe('Sprite', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <canvas
        id="${CANVAS_ID}"
        width="${CANVAS_WIDTH}"
        height="${CANVAS_HEIGHT}"
      >
        <input
          id="${FOCUS_TARGET}"
          type="range"
          min="1"
          max="12"
        />
      </canvas>
      <canvas
        id="${TEST_CANVAS_ID}"
        width="${CANVAS_WIDTH}"
        height="${CANVAS_HEIGHT}"
      />
    `
    canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement
    const testCanvas = document.getElementById(TEST_CANVAS_ID) as HTMLCanvasElement
    focusTarget = document.getElementById(FOCUS_TARGET) as HTMLElement
    focusTarget.focus()
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D
    testCtx = testCanvas.getContext('2d') as CanvasRenderingContext2D
  })

  describe('animate', () => {
    it('delta beneath current duration leaves it where it is', () => {
      const newSprite = animate(MILLIS_PER_FRAME - 1)(testSprite)
      assert.deepStrictEqual(newSprite.frames.lefts.length, 0)
    })
    it('delta equal to current duration advances it', () => {
      const newSprite = animate(MILLIS_PER_FRAME)(testSprite)
      assert.deepStrictEqual(newSprite.frames.lefts.length, 1)
    })
    it('delta above current duration advances it', () => {
      const newSprite = animate(MILLIS_PER_FRAME + 1)(testSprite)
      assert.deepStrictEqual(newSprite.frames.lefts.length, 1)
    })
    it('can multiple frames from a single delta', () => {
      const newSprite = animate(MILLIS_PER_FRAME * 2 + 1)(testSprite)
      assert.deepStrictEqual(newSprite.frames.lefts.length, 2)
    })
    it('frame advancement loops', () => {
      const newSprite = animate(MILLIS_PER_FRAME * 4 + 1)(testSprite)
      assert.deepStrictEqual(newSprite.frames.lefts.length, 0)
    })
  })

  describe('fetchImageElement', () => {
    beforeAll(() => {
      // image onload hack taken from this thread:
      // https://github.com/jsdom/jsdom/issues/1816#issuecomment-569119551
      Object.defineProperty(global.Image.prototype, 'src', {
        set(src) {
          if (src.includes('https')) {
            setTimeout(() => this.dispatchEvent(new Event('load')))
          } else {
            setTimeout(() => this.dispatchEvent(new Event('error')))
          }
        },
      })
    })
    it('load an image url', () => {
      return fetchImageElement(
        'https://mdn.mozillademos.org/files/5397/rhino.jpg',
      )().then((elem) => {
        assert.deepStrictEqual(E.isRight(elem), true)
      })
    })
    it('fail on a broken url', () => {
      return fetchImageElement('not a url')().then((elem) => {
        assert.deepStrictEqual(E.isLeft(elem), true)
      })
    })
  })

  describe('drawImageOffset', () => {
    it('should draw an image to the canvas', () => {
      // source:
      // https://github.com/gcanti/graphics-ts/blob/1c68635d936d3e2151dccad5f16a3d8df2112657/test/Canvas.test.ts#L773

      const offset = S.rect(20, 40, 100, 120)
      const output = S.rect(100, 150, 80, 100)
      const image = new Image()
      image.src = 'https://mdn.mozillademos.org/files/5397/rhino.jpg'
      image.height = 220
      image.width = 440

      // Test
      render(drawImageOffset(image, offset, output))()

      // Actual
      testCtx.drawImage(
        image,
        offset.x,
        offset.y,
        offset.width,
        offset.height,
        output.x,
        output.y,
        output.width,
        output.height,
      )

      assertCalledWith(
        ctx.drawImage as jest.Mock,
        image,
        offset.x,
        offset.y,
        offset.width,
        offset.height,
        output.x,
        output.y,
        output.width,
        output.height,
      )

      assert.deepStrictEqual(ctx.__getDrawCalls(), testCtx.__getDrawCalls())
    })
  })

  describe('drawSprite', () => {
    it('should draw a sprite to the canvas', () => {
      // Test
      render(drawSprite(testSprite))()

      // Actual
      testCtx.drawImage(
        testSprite.src,
        Z.extract(testSprite.frames).rect.x,
        Z.extract(testSprite.frames).rect.y,
        Z.extract(testSprite.frames).rect.width,
        Z.extract(testSprite.frames).rect.height,
        testSprite.rect.x,
        testSprite.rect.y,
        testSprite.rect.width,
        testSprite.rect.height,
      )

      assertCalledWith(
        ctx.drawImage as jest.Mock,
        testSprite.src,
        Z.extract(testSprite.frames).rect.x,
        Z.extract(testSprite.frames).rect.y,
        Z.extract(testSprite.frames).rect.width,
        Z.extract(testSprite.frames).rect.height,
        testSprite.rect.x,
        testSprite.rect.y,
        testSprite.rect.width,
        testSprite.rect.height,
      )

      assert.deepStrictEqual(ctx.__getDrawCalls(), testCtx.__getDrawCalls())
    })
  })
})
