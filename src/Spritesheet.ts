import * as S from 'graphics-ts/lib/Shape'
import * as t from 'io-ts'
import { readonlyNonEmptyArray } from 'io-ts-types/lib/readonlyNonEmptyArray'

export const DimensionsCodec = t.type({
  w: t.number,
  h: t.number,
})
export type Dimensions = t.TypeOf<typeof DimensionsCodec>

const RectCodec = t.intersection([
  DimensionsCodec,
  t.type({
    x: t.number,
    y: t.number,
  }),
])
export type Rect = t.TypeOf<typeof RectCodec>

export const toGraphicsRect = ({ x, y, w, h }: Rect): S.Rect => S.rect(x, y, w, h)
export const toSpriteRect = ({ x, y, width, height }: S.Rect): Rect => ({
  x,
  y,
  w: width,
  h: height,
})

const FrameMetaCodec = t.type({
  image: t.string,
  size: DimensionsCodec,
  scale: t.string,
})

const FrameCodec = t.type({
  frame: RectCodec,
  rotated: t.boolean,
  trimmed: t.boolean,
  spriteSourceSize: RectCodec,
  sourceSize: DimensionsCodec,
})

export const FrameRecordCodec = t.type({
  meta: FrameMetaCodec,
  frames: t.record(t.string, FrameCodec),
})

export type FrameRecord = t.TypeOf<typeof FrameRecordCodec>

export const FrameArrayCodec = t.type({
  meta: FrameMetaCodec,
  frames: readonlyNonEmptyArray(
    t.intersection([t.type({ filename: t.string }), FrameCodec]),
  ),
})

export type FrameArray = t.TypeOf<typeof FrameArrayCodec>
