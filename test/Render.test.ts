import * as assert from 'assert'
import { pipe } from 'fp-ts/pipeable'
import { constVoid } from 'fp-ts/function'
import * as IO from 'fp-ts/IO'
import * as S from 'graphics-ts/lib/Shape'
import * as D from 'graphics-ts/lib/Drawing'
import * as Color from 'graphics-ts/lib/Color'
import { TestScheduler } from 'rxjs/testing'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import { frameDeltaMillis$, renderTo$ } from '../src/Render'

// how-to:
// https://github.com/ReactiveX/rxjs/blob/master/docs_app/content/guide/testing/marble-testing.md

describe('Render', () => {
  describe('frameDeltaMillis$', () => {
    it('outputs the time since the last animation frame, starting at the time of subscription', () => {
      // based on this:
      // https://github.com/ReactiveX/rxjs/blob/master/spec/observables/dom/animationFrames-spec.ts
      new TestScheduler(assert.deepStrictEqual).run(
        ({ animate, cold, expectObservable, time }) => {
          animate('            ---x---x---x')
          const mapped = cold('-m          ')
          const tm = time('    -|          ')
          const ta = time('    ---|        ')
          const tb = time('    -------|    ')
          const tc = time('    -----------|')
          const expected = '   ---a---b---c'
          const subs = '       ^----------!'

          const result = pipe(mapped, ro.mergeMapTo(frameDeltaMillis$))
          expectObservable(result, subs).toBe(expected, {
            a: ta - tm,
            b: tb - ta,
            c: tc - tb,
          })
        },
      )
    })
  })

  describe('renderTo$', () => {
    // sources:
    // https://github.com/gcanti/graphics-ts/blob/master/test/utils.ts

    const CANVAS_ID = 'canvas'
    const TEST_CANVAS_ID = 'test-canvas'
    const FOCUS_TARGET = 'focus-target'
    const CANVAS_WIDTH = 400
    const CANVAS_HEIGHT = 600

    let canvas: HTMLCanvasElement
    let focusTarget: HTMLElement
    let ctx: CanvasRenderingContext2D
    let testCtx: CanvasRenderingContext2D

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
    it('renders a stream of render objects', async () => {
      // source:
      // https://github.com/gcanti/graphics-ts/blob/1c68635d936d3e2151dccad5f16a3d8df2112657/test/Canvas.test.ts#L1703

      const x = 10
      const y = 20
      const width = 100
      const height = 200
      const drawing = D.fill(S.rect(x, y, width, height), D.fillStyle(Color.black))
      const drawing2 = D.fill(
        S.rect(x + 300, y + 300, width, height),
        D.fillStyle(Color.black),
      )

      // Test
      await pipe(
        r.from([D.render(drawing), D.render(drawing2)]),
        renderTo$(CANVAS_ID, IO.of(constVoid)),
        (obs) => r.lastValueFrom(obs),
      )

      // Actual
      testCtx.save()
      testCtx.fillStyle = pipe(Color.black, Color.toCss)
      testCtx.beginPath()
      testCtx.rect(x, y, width, height)
      testCtx.fill()
      testCtx.restore()

      testCtx.save()
      testCtx.fillStyle = pipe(Color.black, Color.toCss)
      testCtx.beginPath()
      testCtx.rect(x + 300, y + 300, width, height)
      testCtx.fill()
      testCtx.restore()

      assert.deepStrictEqual(ctx.__getEvents(), testCtx.__getEvents())
    })
  })
})
