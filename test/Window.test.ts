import { pipe } from 'fp-ts/pipeable'
import * as S from 'graphics-ts/lib/Shape'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import * as assert from 'assert'
import { windowInnerHeight, windowInnerWidth, windowRect$ } from '../src/Window'

// source:
// https://stackoverflow.com/questions/45868042/figuring-out-how-to-mock-the-window-size-changing-for-a-react-component-test

const mutateWindowSize = (dimension: 'Width' | 'Height', value: number) =>
  Object.defineProperty(window, `inner${dimension}`, {
    writable: true,
    configurable: true,
    value,
  })

const initialWidth = 100
const initialHeight = 100

describe('window helpers', () => {
  beforeEach(() => {
    mutateWindowSize('Width', initialWidth)
    mutateWindowSize('Height', initialHeight)
  })
  describe('windowInnerWidth', () => {
    it('should get the correct width', () => {
      expect(windowInnerWidth()).toBe(initialWidth)
    })
  })

  describe('windowInnerHeight', () => {
    it('should get the correct height', () => {
      expect(windowInnerHeight()).toBe(initialHeight)
    })
  })

  describe('windowRect$', () => {
    it('should get a stream of the correct dimensions', () => {
      // source:
      // https://gist.github.com/remarkablemark/8e5a247a663db40f2a2abe420ac43234
      const complete$ = new r.Subject<S.Rect[]>()
      pipe(windowRect$, ro.take(3), ro.toArray(), (obs) => obs.subscribe(complete$))

      window.dispatchEvent(new Event('load'))

      mutateWindowSize('Width', 200)
      mutateWindowSize('Height', 200)
      window.dispatchEvent(new Event('resize'))

      mutateWindowSize('Width', 300)
      mutateWindowSize('Height', 300)
      window.dispatchEvent(new Event('resize'))

      return r
        .firstValueFrom(complete$)
        .then((windowRects) =>
          assert.deepStrictEqual(windowRects, [
            S.rect(0, 0, initialWidth, initialHeight),
            S.rect(0, 0, 200, 200),
            S.rect(0, 0, 300, 300),
          ]),
        )
    })
  })
})
