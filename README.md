# game-ts

Combines graphics-ts with rxjs, plus disperate utilities for input & sprites

# example usage

```ts
import { error } from 'fp-ts/Console'
import { pipe } from 'fp-ts/pipeable'
import * as Z from 'fp-ts-contrib/lib/Zipper'
import * as S from 'graphics-ts/lib/Shape'
import * as ro from 'rxjs/operators'
import { frameDeltaMillis$, renderTo$ } from 'game-ts/Render'
import { animate, drawSprite, Sprite, SpriteFrame } from 'game-ts/Sprite'
import { windowRect$ } from 'game-ts/Window'
import greenCap from './greenCap.png'

export const MILLIS_PER_FRAME = 200

const frameForIndex = (x: number): SpriteFrame => ({
  rect: S.rect(16 * x, 0, 16, 18),
  duration: MILLIS_PER_FRAME,
})

const initialSprite: Sprite = {
  animationDelta: 0,
  frames: Z.fromNonEmptyArray<SpriteFrame>([
    frameForIndex(0),
    frameForIndex(1),
    frameForIndex(0),
    frameForIndex(2),
  ]),
  rect: S.rect(0, 0, 50, 56),
  src: greenCap,
}

const frame$ = pipe(
  frameDeltaMillis$,
  ro.scan((sprite, deltaMillis) => pipe(sprite, animate(deltaMillis)), initialSprite),
  ro.withLatestFrom(windowRect$),
  OB.map(([sprite, windowRect]) =>
    pipe(
      C.clearRect(windowRect),
      R.chain(() => drawSprite(sprite)),
    ),
  )
  renderTo$('canvas', () => error('canvas not found')),
)
frame$.subscribe()
```

# in-depth example

[game-demo-parcel](https://github.com/anthonyjoeseph/game-demo-parcel)