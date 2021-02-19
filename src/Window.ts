import * as OB from 'fp-ts-rxjs/lib/Observable'
import { sequenceT } from 'fp-ts/Apply'
import * as IO from 'fp-ts/IO'
import { pipe } from 'fp-ts/pipeable'
import { Rect, rect } from 'graphics-ts/lib/Shape'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'

export const windowInnerWidth: IO.IO<number> = () => window.innerWidth

export const windowInnerHeight: IO.IO<number> = () => window.innerHeight

const windowSubj = new r.BehaviorSubject(rect(0, 0, 0, 0))
pipe(
  r.merge(r.fromEvent(window, 'load'), r.fromEvent(window, 'resize')),
  OB.chain(() => OB.fromIO(sequenceT(IO.io)(windowInnerWidth, windowInnerHeight))),
  ro.map(([width, height]) => rect(0, 0, width, height)),
  obs => obs.subscribe(windowSubj)
)
export const windowRect$ = windowSubj as r.Observable<Rect>