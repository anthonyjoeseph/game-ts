import { pipe } from 'fp-ts/pipeable'
import { flow } from 'fp-ts/function'
import * as IO from 'fp-ts/IO'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import * as C from 'graphics-ts/lib/Canvas'

export const frameDeltaMillis$ = pipe(
  r.animationFrames(),
  OB.map(({ elapsed }) => elapsed),
  ro.startWith(0),
  ro.pairwise(),
  OB.map(([prev, cur]) => cur - prev),
)

export const renderTo$ = <A>(
  canvasId: string,
  onCanvasNotFound: () => IO.IO<void>,
): ((ma: r.Observable<C.Render<A>>) => r.Observable<void>) =>
  OB.chain<C.Render<A>, void>(flow(C.renderTo(canvasId, onCanvasNotFound), OB.fromIO))
