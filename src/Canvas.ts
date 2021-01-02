import { pipe } from 'fp-ts/pipeable'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/ReadonlyArray'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import * as C from 'graphics-ts/lib/Canvas'
import * as S from 'graphics-ts/lib/Shape'
import { ResizeObserver } from '@juggle/resize-observer'
import { fromIOSync } from './Observable'

export const canvasRect: C.Html<S.Rect> = (canvas) => () => {
  const domrect = canvas.getBoundingClientRect()
  return S.rect(domrect.left, domrect.right, domrect.width, domrect.height)
}

export const canvasRect$ = (canvasId: string): r.Observable<O.Option<S.Rect>> =>
  pipe(
    C.getCanvasElementById(canvasId),
    fromIOSync,
    OB.chain(
      O.fold(
        () => OB.of(O.none),
        (canvasElem) => {
          const onResizeCanvas$ = new r.Observable<never>((sub) => {
            const resizes = new ResizeObserver(A.map(() => sub.next()))
            resizes.observe(canvasElem)
          })
          return pipe(
            r.merge(r.of(undefined), onResizeCanvas$),
            OB.chain(() => pipe(canvasElem, canvasRect, OB.fromIO)),
            ro.map(O.some),
          )
        },
      ),
    ),
  )
