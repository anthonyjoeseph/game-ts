import { pipe } from 'fp-ts/pipeable'
import * as O from 'fp-ts/Option'
import * as r from 'rxjs'
import * as ro from 'rxjs/operators'
import * as assert from 'assert'
import { Key } from 'ts-key-enum'
import { pressedKeys$, mouseDrag$ } from '../src/Input'
import { fireEvent } from '@testing-library/dom'

describe('Input', () => {
  describe('pressedKeys$', () => {
    it('should get a stream of the current pressed keys', async () => {
      const complete$ = new r.Subject<string[][]>()
      pipe(
        pressedKeys$,
        ro.observeOn(r.asyncScheduler),
        ro.take(5),
        ro.toArray(),
        (obs) => obs.subscribe(complete$),
      )

      fireEvent.keyDown(window, { code: Key.ArrowDown })
      fireEvent.keyDown(window, { code: 'a' })
      fireEvent.keyUp(window, { code: Key.ArrowDown })
      fireEvent.keyUp(window, { code: 'a' })

      return r
        .firstValueFrom(complete$)
        .then((keyss) =>
          assert.deepStrictEqual(keyss, [
            [],
            [Key.ArrowDown],
            [Key.ArrowDown, 'a'],
            ['a'],
            [],
          ]),
        )
    })
  })
  describe('mouseDrag$', () => {
    it('should get a stream of the current mouse drag state', async () => {
      const complete$ = new r.Subject<O.Option<Event>[]>()
      pipe(mouseDrag$, ro.observeOn(r.asyncScheduler), ro.take(5), ro.toArray(), (obs) =>
        obs.subscribe(complete$),
      )

      fireEvent.mouseDown(window, { offsetX: 1, offsetY: 1 })
      fireEvent.mouseMove(window, { offsetX: 2, offsetY: 2 })
      fireEvent.mouseMove(window, { offsetX: 3, offsetY: 3 })
      fireEvent.mouseUp(window)

      return r.firstValueFrom(complete$).then((mouseDragStates) =>
        assert.deepStrictEqual(mouseDragStates, [
          O.none,
          // user-fired mouse events are not 'trusted'
          // not sure how to test that offsetX and offsetY are correct
          O.some(new MouseEvent('')),
          O.some(new MouseEvent('')),
          O.some(new MouseEvent('')),
          O.none,
        ]),
      )
    })
  })
})
