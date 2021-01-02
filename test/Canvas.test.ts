import { pipe } from 'fp-ts/pipeable'
import * as S from 'graphics-ts/lib/Shape'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import * as assert from 'assert'
import { canvasRect, canvasRect$ } from '../src/Canvas'

const initialWidth = 100
const initialHeight = 100

describe('canvas helpers', () => {
  const CANVAS_ID = 'canvas'
  const FOCUS_TARGET = 'focus-target'

  let canvas: HTMLCanvasElement
  let focusTarget: HTMLElement
  beforeEach(() => {
    document.body.innerHTML = `
      <canvas
        id="${CANVAS_ID}"
        width="${initialWidth}"
        height="${initialHeight}"
      >
        <input
          id="${FOCUS_TARGET}"
          type="range"
          min="1"
          max="12"
        />
      </canvas>
    `
    canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement
    focusTarget = document.getElementById(FOCUS_TARGET) as HTMLElement
    focusTarget.focus()
  })
  describe('canvasClientBoundingRect', () => {
    it('should get the correct bounding rect', () => {
      assert.deepStrictEqual(canvasRect(canvas)(), S.rect(0, 0, 0, 0))
    })
  })

  describe('canvasRect$', () => {
    it('should get a stream of the correct dimensions', () => {
      // source:
      // https://gist.github.com/remarkablemark/8e5a247a663db40f2a2abe420ac43234
      const complete$ = new r.Subject<S.Rect[]>()
      pipe(
        canvasRect$(CANVAS_ID),
        ro.observeOn(r.asyncScheduler),
        OB.compact,
        ro.take(1),
        ro.toArray(),
        (obs) => obs.subscribe(complete$),
      )

      return pipe(complete$, r.firstValueFrom, (p) =>
        p.then((windowRects) =>
          assert.deepStrictEqual(windowRects, [S.rect(0, 0, 0, 0)]),
        ),
      )
    })
  })
})
