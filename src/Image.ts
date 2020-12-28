import * as TE from 'fp-ts/TaskEither'
import * as C from 'graphics-ts/lib/Canvas'
import * as S from 'graphics-ts/lib/Shape'
import fetchIMG from 'fetch-img'

export const fetchImageElement = (
  source: string,
): TE.TaskEither<Event, HTMLImageElement> =>
  TE.tryCatch(
    () => fetchIMG(source),
    (err) => err as Event,
  )

export const drawImageOffset = (
  src: C.ImageSource,
  offset: S.Rect,
  output: S.Rect,
): C.Render<CanvasRenderingContext2D> =>
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
