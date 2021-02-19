import * as R from 'fp-ts-contrib/lib/ReaderIO'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import * as OBE from 'fp-ts-rxjs/lib/ObservableEither'
import * as E from 'fp-ts/Either'
import { Endomorphism } from 'fp-ts/function'
import { pipe } from 'fp-ts/pipeable'
import * as C from 'graphics-ts/lib/Canvas'
import * as S from 'graphics-ts/lib/Shape'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import { canvasRect$ } from './Canvas'

const renderTo$ = (canvasId: string) => <A>(render: C.Render<A>) => {
  const lefts = new r.Subject<E.Either<RenderError, void>>()
  const rights: OBE.ObservableEither<RenderError, void> = pipe(
    render,
    C.renderTo(canvasId, () => () => lefts.next(E.left('CannotRender'))),
    OB.fromIO,
    ro.tap(() => lefts.complete()),
    OBE.rightObservable,
  )
  return r.merge(lefts, rights)
}

export type RenderError = 'NoCanvasRect' | 'CannotRender'
export const renderWithState$ = <S, A = CanvasRenderingContext2D>(
  initialState: S,
  input: (state$: r.Observable<S>) => r.Observable<Endomorphism<S>>,
  render: (state: S) => C.Render<A>,
  canvasId: string,
): OBE.ObservableEither<RenderError, void> => {
  const state$ = new r.BehaviorSubject<S>(initialState)
  return pipe(
    state$,
    input,
    ro.withLatestFrom(state$),
    OB.map(([modify, state]) => modify(state)),
    ro.tap((state) => state$.next(state)),
    ro.startWith(initialState),
    ro.observeOn(r.animationFrameScheduler),
    ro.withLatestFrom(canvasRect$(canvasId)),
    OB.chain(
      ([state, canvasRectOpt]): OBE.ObservableEither<RenderError, void> =>
        pipe(
          canvasRectOpt,
          OB.of,
          OB.map(E.fromOption((): RenderError => 'NoCanvasRect')),
          OBE.chain((canvasRect) =>
            pipe(
              C.clearRect(S.rect(0, 0, canvasRect.width, canvasRect.height)),
              R.chain(() => render(state)),
              renderTo$(canvasId),
            ),
          ),
        ),
    ),
  )
}
