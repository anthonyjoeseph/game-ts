import * as r from 'rxjs'
import * as IO from 'fp-ts/IO'

export const fromIOSync = <A>(a: IO.IO<A>): r.Observable<A> => r.defer(() => r.of(a()))
