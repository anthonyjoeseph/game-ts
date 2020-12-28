import { pipe } from 'fp-ts/pipeable'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/ReadonlyArray'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import * as C from 'graphics-ts/lib/Canvas'
import * as S from 'graphics-ts/lib/Shape'
import { ResizeObserver } from '@juggle/resize-observer'

export const canvasClientBoundingRect: C.Html<DOMRect> = (canvas) => () =>
  canvas.getBoundingClientRect()

export const canvasRect$ = (canvasId: string): r.Observable<O.Option<S.Rect>> =>
  pipe(
    C.getCanvasElementById(canvasId),
    OB.fromIO,
    OB.chain(
      O.fold(
        () => OB.of(O.none),
        (canvasElem) => {
          const onResizeCanvas$ = new r.Observable<never>((sub) => {
            const resizes = new ResizeObserver(A.map(() => sub.next()))
            resizes.observe(canvasElem)
          })
          canvasElem.getBoundingClientRect()
          canvasElem.style.left
          return pipe(
            onResizeCanvas$,
            ro.startWith(),
            OB.chain(() => pipe(canvasElem, canvasClientBoundingRect, OB.fromIO)),
            ro.map(({ x, y, width, height }) => S.rect(x, y, width, height)),
            ro.map(O.some),
          )
        },
      ),
    ),
  )
