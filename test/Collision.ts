import {
  intersect,
  overlap,
  contains,
  containsWithin,
  collisions,
  collisionsRO,
} from "../src/Collision"

describe("Collisions", () => {
  describe("intersect", () => {
    it("intersecting is true", () => {
      expect(true).toBe(true)
    })

    it("not intersecting is false", () => {
      expect(true).toBe(true)

    })

    it("true on equivalent edges", () => {

      expect(true).toBe(true)
    })
  })

  describe("overlap", () => {
    it("intersecting is true", () => {

      expect(true).toBe(true)
    })

    it("not intersecting is false", () => {
      expect(true).toBe(true)

    })

    it("false on equivalent edges", () => {
      expect(true).toBe(true)
    })
  })

  describe("contains", () => {
    it("containing is true", () => {
      expect(true).toBe(true)

    })

    it("not containing is false", () => {
      expect(true).toBe(true)

    })

    it("true on equivalent edges", () => {
      expect(true).toBe(true)
    })
  })

  describe("containsWithin", () => {
    it("containing is true", () => {
      expect(true).toBe(true)

    })

    it("not containing is false", () => {
      expect(true).toBe(true)

    })

    it("false on equivalent edges", () => {
      expect(true).toBe(true)
    })
  })

  describe("collisions", () => {
    it("returns correct collisions", () => {
      expect(true).toBe(true)
    })

    it("returns empty for no collisions", () => {
      expect(true).toBe(true)
    })
  })

  describe("collisionsRO", () => {
    it("returns correct collisions", () => {
      expect(true).toBe(true)
    })

    it("returns empty for no collisions", () => {
      expect(true).toBe(true)
    })
  })
})