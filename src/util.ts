import * as r from 'rxjs'
import * as IO from 'fp-ts/IO'

/**
 * fp-ts-rxjs's implementation of `fromIO` lifts the io into a promise
 *
 * Promises are incompatible with rxjs's TestScheduler:
 * https://github.com/ReactiveX/rxjs/pull/745
 *
 * Since we test with TestScheduler, we syncronous IO
 * @param a IO to be lifted into an observable
 */
export const fromIOSync = <A>(a: IO.IO<A>): r.Observable<A> => r.defer(() => r.of(a()))
