import { pipe } from 'fp-ts/pipeable'
import * as Eq from 'fp-ts/Eq'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'
import { without } from 'fp-ts-std/Array'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import * as OB from 'fp-ts-rxjs/lib/Observable'

type PressType = 'up' | 'down'
interface Press {
  code: string
  type: PressType
}

const pressFromEvent = (type: PressType) => (event: Event): Press => ({
  code: (event as KeyboardEvent).code,
  type,
})

export const pressedKeys$ = pipe(
  r.merge(
    pipe(r.fromEvent(window, 'keydown'), ro.map(pressFromEvent('down'))),
    pipe(r.fromEvent(window, 'keyup'), ro.map(pressFromEvent('up'))),
  ),
  ro.scan(
    ({ keys }: { keys: Array<string>; emit: boolean }, press: Press) => {
      if (press.type === 'up') {
        return {
          keys: without(Eq.eqString)([press.code])(keys),
          emit: true,
        }
      }
      if (pipe(keys, A.elem(Eq.eqString)(press.code))) {
        return { keys: keys, emit: false }
      }
      return { keys: A.snoc(keys, press.code), emit: true }
    },
    { keys: [], emit: true },
  ),
  OB.filterMap(({ keys, emit }) =>
    pipe(
      keys,
      O.fromPredicate(() => emit),
    ),
  ),
  ro.startWith([] as Array<string>),
)

// adapted from from Juan Herrera's article here:
// https://medium.com/@jdjuan/mouse-drag-with-rxjs-45861c4d0b7e
export const mouseDrag$: r.Observable<O.Option<Event>> = pipe(
  r.fromEvent(window, 'mousedown'),
  ro.mergeMap((down) =>
    pipe(
      r.fromEvent(window, 'mousemove'),
      ro.map(O.some),
      ro.takeUntil(r.fromEvent(window, 'mouseup')),
      ro.startWith(O.some(down)),
      ro.endWith(O.none),
    ),
  ),
  ro.startWith(O.none),
)
