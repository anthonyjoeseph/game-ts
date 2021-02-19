import { ResizeObserver } from '@juggle/resize-observer'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import * as O from 'fp-ts/Option'
import { pipe } from 'fp-ts/pipeable'
import * as A from 'fp-ts/ReadonlyArray'
import * as C from 'graphics-ts/lib/Canvas'
import * as S from 'graphics-ts/lib/Shape'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'

export const canvasRect: C.Html<S.Rect> = (canvas) => () => {
  const domrect = canvas.getBoundingClientRect()
  return S.rect(domrect.left, domrect.right, domrect.width, domrect.height)
}

export const canvasRect$ = (canvasId: string): r.Observable<O.Option<S.Rect>> => {
  const canvasSubj = new r.BehaviorSubject<O.Option<S.Rect>>(O.none)
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
          return pipe(
            r.concat(r.of(undefined), onResizeCanvas$),
            OB.chain(() => pipe(canvasElem, canvasRect, OB.fromIO)),
            ro.map(O.some),
          )
        },
      ),
    ),
    obs => obs.subscribe(n => canvasSubj.next(n))
  )
  return canvasSubj
}