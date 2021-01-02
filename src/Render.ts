import { pipe } from 'fp-ts/pipeable'
import { Endomorphism, flow } from 'fp-ts/function'
import * as IO from 'fp-ts/IO'
import * as O from 'fp-ts/Option'
import * as R from 'fp-ts-contrib/lib/ReaderIO'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import * as C from 'graphics-ts/lib/Canvas'
import * as S from 'graphics-ts/lib/Shape'
import { canvasRect$ } from './Canvas'
import { fromIOSync } from './Observable'

export const frameDeltaMillis$ = pipe(
  r.animationFrames(),
  OB.map(({ elapsed }) => elapsed),
  ro.startWith(0),
  ro.pairwise(),
  OB.map(([prev, cur]) => cur - prev),
)

export const gameLoop$ = <S, A = CanvasRenderingContext2D>(
  initialState: S,
  input: (state$: r.Observable<S>) => r.Observable<Endomorphism<S>>,
  render: (state: S) => C.Render<A>,
  canvasId: string,
  onCanvasNotFound: () => IO.IO<void>,
): r.Observable<void> => {
  const state$ = new r.BehaviorSubject<S>(initialState)
  return pipe(
    state$,
    input,
    ro.withLatestFrom(state$),
    OB.map(([modify, state]) => modify(state)),
    ro.tap((state) => state$.next(state)),
    ro.startWith(initialState),
    ro.observeOn(r.animationFrameScheduler),
    ro.withLatestFrom(
      pipe(
        canvasRect$(canvasId),
        OB.chainFirst(O.fold(flow(onCanvasNotFound, fromIOSync), () => OB.of(undefined))),
        OB.compact,
      ),
    ),
    OB.chain(
      ([state, canvasRect]): r.Observable<void> =>
        pipe(
          C.clearRect(S.rect(0, 0, canvasRect.width, canvasRect.height)),
          R.chain(() => render(state)),
          C.renderTo(canvasId, onCanvasNotFound),
          fromIOSync,
        ),
    ),
  )
}
