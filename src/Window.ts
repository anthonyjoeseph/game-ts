import { pipe } from 'fp-ts/pipeable'
import { sequenceT } from 'fp-ts/Apply'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import * as OB from 'fp-ts-rxjs/lib/Observable'
import * as IO from 'fp-ts/IO'
import { rect } from 'graphics-ts/lib/Shape'
import { fromIOSync } from './Observable'

export const windowInnerWidth: IO.IO<number> = () => window.innerWidth

export const windowInnerHeight: IO.IO<number> = () => window.innerHeight

export const windowRect$ = pipe(
  r.merge(r.fromEvent(window, 'load'), r.fromEvent(window, 'resize')),
  OB.chain(() => fromIOSync(sequenceT(IO.io)(windowInnerWidth, windowInnerHeight))),
  ro.map(([width, height]) => rect(0, 0, width, height)),
)
