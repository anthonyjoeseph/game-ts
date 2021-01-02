import * as assert from 'assert'
import { pipe } from 'fp-ts/pipeable'
import { constVoid } from 'fp-ts/function'
import { add } from 'fp-ts-std/Number'
import * as IO from 'fp-ts/IO'
import * as S from 'graphics-ts/lib/Shape'
import * as D from 'graphics-ts/lib/Drawing'
import * as Color from 'graphics-ts/lib/Color'
import { TestScheduler } from 'rxjs/testing'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import { frameDeltaMillis$, gameLoop$ } from '../src/Render'

// how-to:
// https://github.com/ReactiveX/rxjs/blob/master/docs_app/content/guide/testing/marble-testing.md

describe('Render', () => {
  const CANVAS_ID = 'canvas'

  describe('frameDeltaMillis$', () => {
    /*it('outputs the time since the last animation frame, starting at the first animation frame', () => {
      // based on this:
      // https://github.com/ReactiveX/rxjs/blob/master/spec/observables/dom/animationFrames-spec.ts
      new TestScheduler(assert.deepStrictEqual).run(
        ({ animate, cold, expectObservable, time }) => {
          animate('            x--x---x---x')
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
    })*/
  })

  describe('gameLoop$', () => {
    it('outputs the time since the last animation frame, starting at the time of subscription', () => {
      // based on this:
      // https://github.com/ReactiveX/rxjs/blob/master/spec/observables/dom/animationFrames-spec.ts
      new TestScheduler(assert.deepStrictEqual).run(
        ({ animate, hot, cold, expectObservable, time }) => {
          const TEST_CANVAS_ID = 'test-canvas'
          const FOCUS_TARGET = 'focus-target'
          const CANVAS_WIDTH = 400
          const CANVAS_HEIGHT = 600
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
          const focusTarget = document.getElementById(FOCUS_TARGET) as HTMLElement
          focusTarget.focus()

          animate('            ---x---x---x')
          const mapped = cold('-m          ')
          const input = hot(' 1----2---3--')
          const ta = time('    ---|        ')
          const tb = time('    -------|    ')
          const tc = time('    -----------|')
          const expected = '   ---a---b---c'
          const subs = '       ^----------!'

          const result = pipe(
            mapped,
            ro.mergeMapTo(
              gameLoop$(
                0,
                () => pipe(input, ro.mapTo(add(1))),
                () =>
                  pipe(D.fill(S.rect(0, 0, 0, 0), D.fillStyle(Color.black)), D.render),
                CANVAS_ID,
                IO.of(constVoid),
              ),
            ),
            ro.mapTo(1),
          )
          expectObservable(result, subs).toBe(expected, {
            a: 1,
            b: 1,
            c: 1,
          })
        },
      )
    })

    /*it('renders based on the current state', async () => {
      const TEST_CANVAS_ID = 'test-canvas'
      const FOCUS_TARGET = 'focus-target'
      const CANVAS_WIDTH = 400
      const CANVAS_HEIGHT = 600

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
      const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement
      const testCanvas = document.getElementById(TEST_CANVAS_ID) as HTMLCanvasElement
      const focusTarget = document.getElementById(FOCUS_TARGET) as HTMLElement
      focusTarget.focus()
      const ctx = canvas.getContext('2d') as CanvasRenderingContext2D
      const testCtx = testCanvas.getContext('2d') as CanvasRenderingContext2D

      const firstX = 10
      const y = 20
      const width = 100
      const height = 200

      // Test
      await pipe(
        gameLoop$(
          firstX,
          () => r.from([add(1), add(1)]),
          (x) =>
            pipe(D.fill(S.rect(x, y, width, height), D.fillStyle(Color.black)), D.render),
          CANVAS_ID,
          IO.of(constVoid),
        ),
        (obs) => r.lastValueFrom(obs),
      )

      // Actual

      testCtx.clearRect(0, 0, 0, 0)

      testCtx.save()
      testCtx.fillStyle = pipe(Color.black, Color.toCss)
      testCtx.beginPath()
      testCtx.rect(firstX, y, width, height)
      testCtx.fill()
      testCtx.restore()

      testCtx.clearRect(0, 0, 0, 0)

      testCtx.save()
      testCtx.fillStyle = pipe(Color.black, Color.toCss)
      testCtx.beginPath()
      testCtx.rect(firstX + 1, y, width, height)
      testCtx.fill()
      testCtx.restore()

      testCtx.clearRect(0, 0, 0, 0)

      testCtx.save()
      testCtx.fillStyle = pipe(Color.black, Color.toCss)
      testCtx.beginPath()
      testCtx.rect(firstX + 2, y, width, height)
      testCtx.fill()
      testCtx.restore()

      assert.deepStrictEqual(ctx.__getEvents(), testCtx.__getEvents())
    })*/
  })
})
