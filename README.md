# game-ts

Combines graphics-ts with rxjs, plus disparate utilities for input & sprites

# example usage

Toggles between blue and black when the 'Enter' key is pressed

```ts
import { Endomorphism } from 'fp-ts/function'
import { pipe } from 'fp-ts/pipeable'
import { invert } from 'fp-ts-std/Boolean'
import { error } from 'fp-ts/Console'
import * as S from 'graphics-ts/lib/Shape'
import * as D from 'graphics-ts/lib/Drawing'
import * as Color from 'graphics-ts/lib/Color'
import { Key } from 'ts-key-enum'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import { gameLoop$ } from 'game-ts/dist/Render'

type State = boolean

const initialState: State = false
const frame$ = gameLoop$<State>(
  initialState,
  (state$: r.Observable<State>): r.Observable<Endomorphism<State>> =>
    pipe(
      r.fromEvent(window, 'keydown'),
      ro.map((e) => (e as KeyboardEvent).code),
      ro.filter((e) => e === Key.Enter),
      ro.mapTo(invert),
    ),
  (state: State) =>
    // renders on a window.requestAnimationFrame schedule via rxjs
    // the canvas is cleared before each render
    pipe(
      D.fill(
        S.rect(0, 0, 100, 100),
        D.fillStyle(state ? Color.hex('#0400ff') : Color.black),
      ),
      D.render,
    ),
  'canvas',
  () => error('canvas not found'),
)
frame$.subscribe()
```

# features

- [io-ts](https://github.com/gcanti/io-ts) codecs for

  - spritesheets via [spritesheet.js](https://github.com/krzysztof-o/spritesheet.js) or [TexturePacker](https://www.codeandweb.com/texturepacker)
  - levels via [Tiled](https://www.mapeditor.org/)

- rectangle conversions for denotative geometry (collisions etc) with [geometric.js](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/geometric/index.d.ts)

- various utilities for `Canvas`, `Window`, images, `Zipper` (from [fp-ts-contrib](https://github.com/gcanti/fp-ts-contrib/blob/master/test/Zipper.ts)) and mouse/keyboard input

# in-depth example

[game-demo-parcel](https://github.com/anthonyjoeseph/game-demo-parcel)

# pairs well with

- box2D physics via [planck.js](https://github.com/shakiba/planck.js/blob/master/lib/index.d.ts) ([world.step](https://github.com/shakiba/planck.js/blob/master/docs/classes/world.md#step) works well with [frameDeltaMillis$](https://github.com/anthonyjoeseph/game-ts/blob/master/src/Render.ts))
