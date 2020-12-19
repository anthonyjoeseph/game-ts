import { pipe } from 'fp-ts/pipeable'
import { flow } from 'fp-ts/function'
import * as IO from 'fp-ts/IO'
import { now } from 'fp-ts/Date'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import * as C from 'graphics-ts/lib/Canvas'

export const frameDeltaMillis$ = pipe(
  r.timer(0, 0, r.animationFrameScheduler),
  OB.chain(() => OB.fromIO(now)),
  ro.pairwise(),
  OB.map(([prevTime, currentTime]) => currentTime - prevTime),
  ro.startWith(0),
)

export const renderTo$ = <A>(
  canvasId: string,
  onCanvasNotFound: () => IO.IO<void>
): (ma: r.Observable<C.Render<A>>) => r.Observable<void> =>
  OB.chain<C.Render<A>, void>(flow(C.renderTo(canvasId, onCanvasNotFound), OB.fromIO))
