import * as assert from 'assert'
import * as E from 'fp-ts/Either'
import * as t from 'io-ts'
import {
  HexColorCodec,
  ObjectCodec,
  ObjectTemplateCodec,
  TilesetCodec,
  MapCodec,
  ObjectTemplate,
  TiledObject,
} from '../src/Tiled'
import * as tilesheet from './resources/tilesheet.json'
import * as tilemap from './resources/tilemap.json'

describe('Tiled', () => {
  const goodObject: TiledObject = {
    height: 10 as t.Branded<number, t.IntBrand>,
    id: 1 as t.Branded<number, t.IntBrand>,
    name: 'test',
    rotation: 0,
    type: '??',
    visible: true,
    width: 10 as t.Branded<number, t.IntBrand>,
    x: 10 as t.Branded<number, t.IntBrand>,
    y: 10 as t.Branded<number, t.IntBrand>,
  }
  describe('HexColorCodec', () => {
    it('succeeds when good', () => {
      assert.deepStrictEqual(E.isRight(HexColorCodec.decode('#000000')), true)
    })
    it('fails when bad', () => {
      assert.deepStrictEqual(E.isLeft(HexColorCodec.decode('bad')), true)
    })
  })

  describe('ObjectCodec', () => {
    it('succeeds when good', () => {
      assert.deepStrictEqual(E.isRight(ObjectCodec.decode(goodObject)), true)
    })
    it('fails when bad', () => {
      const badObject = { bad: true }
      assert.deepStrictEqual(E.isLeft(ObjectCodec.decode(badObject)), true)
    })
  })

  describe('ObjectTemplateCodec', () => {
    it('succeeds when good', () => {
      const goodObjectTemplate: ObjectTemplate = {
        object: goodObject,
        tileset: {
          columns: 10 as t.Branded<number, t.IntBrand>,
          image: 'test.png',
          imageheight: 10 as t.Branded<number, t.IntBrand>,
          imagewidth: 10 as t.Branded<number, t.IntBrand>,
          margin: 0 as t.Branded<number, t.IntBrand>,
          name: 'test',
          objectalignment: 'unspecified',
          spacing: 0 as t.Branded<number, t.IntBrand>,
          tilecount: 100 as t.Branded<number, t.IntBrand>,
          tileheight: 32 as t.Branded<number, t.IntBrand>,
          tilewidth: 32 as t.Branded<number, t.IntBrand>,
        },
        type: 'template',
      }
      assert.deepStrictEqual(
        E.isRight(ObjectTemplateCodec.decode(goodObjectTemplate)),
        true,
      )
    })
    it('fails when bad', () => {
      const badObjectTemplate = { bad: true }
      assert.deepStrictEqual(
        E.isLeft(ObjectTemplateCodec.decode(badObjectTemplate)),
        true,
      )
    })
  })

  describe('TilesetCodec', () => {
    it('succeeds when good', () => {
      assert.deepStrictEqual(E.isRight(TilesetCodec.decode(tilesheet)), true)
    })
    it('fails when bad', () => {
      const badTileset = { name: false }
      assert.deepStrictEqual(E.isLeft(TilesetCodec.decode(badTileset)), true)
    })
  })

  describe('MapCodec', () => {
    it('succeeds when good', () => {
      const a = MapCodec.decode(tilemap)
      assert.deepStrictEqual(E.isRight(a), true)
    })
    it('fails when bad', () => {
      const badMap = { bad: 4 }
      assert.deepStrictEqual(E.isLeft(MapCodec.decode(badMap)), true)
    })
  })
})
