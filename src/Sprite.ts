import { pipe } from 'fp-ts/pipeable'
import { Endomorphism, identity } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as A from 'fp-ts/Array'
import * as Z from 'fp-ts-contrib/lib/Zipper'
import * as TE from 'fp-ts/TaskEither'
import * as L from 'monocle-ts/lib/Lens'
import * as C from 'graphics-ts/lib/Canvas'
import { Rect } from 'graphics-ts/lib/Shape'
import fetchIMG from 'fetch-img'

export interface SpriteFrame {
  rect: Rect
  duration: number
}

export interface Sprite {
  readonly src: C.ImageSource
  readonly rect: Rect
  readonly frames: Z.Zipper<SpriteFrame>
  readonly animationDelta: number
}

const loopingAdvance = <A>(z: Z.Zipper<A>): Z.Zipper<A> =>
  pipe(
    z,
    Z.down,
    O.getOrElse(() => Z.start(z)),
  )

const numFramesToAdvance = (
  deltaMillis: number,
  animationDelta: number,
  duration: number,
) => Math.floor((deltaMillis + animationDelta) / duration)

const newAnimationDelta = (
  deltaMillis: number,
  animationDelta: number,
  duration: number,
) => (deltaMillis + animationDelta) % duration

export const animate = (deltaMillis: number): Endomorphism<Sprite> =>
  pipe(
    L.id<Sprite>(),
    L.props('animationDelta', 'frames'),
    L.modify(({ animationDelta, frames }) => ({
      animationDelta: newAnimationDelta(
        deltaMillis,
        animationDelta,
        Z.extract(frames).duration,
      ),
      frames: pipe(
        A.makeBy(
          numFramesToAdvance(deltaMillis, animationDelta, Z.extract(frames).duration),
          identity,
        ),
        A.reduce(frames, loopingAdvance),
      ),
    })),
  )

export const fetchImageElement = (source: string) =>
  TE.tryCatch(
    () => fetchIMG(source),
    (err) => err as Event,
  )

export const drawImageOffset = (src: C.ImageSource, offset: Rect, output: Rect) =>
  C.drawImageFull(
    src,
    offset.x,
    offset.y,
    offset.width,
    offset.height,
    output.x,
    output.y,
    output.width,
    output.height,
  )

export const drawSprite = (sprite: Sprite) =>
  drawImageOffset(sprite.src, Z.extract(sprite.frames).rect, sprite.rect)
