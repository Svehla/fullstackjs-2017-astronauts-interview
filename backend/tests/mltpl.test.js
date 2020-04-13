import { mltpl, divsn } from "../src/mltpl.js"
let chai = require("chai")

var expect = chai.expect
var foo = "bar"

describe("stringy", () => {
  //describe('', () => {

  it("foo tested", () => {
    expect(foo).to.be.a("string")
    expect(foo).to.equal("bar")
    expect(foo).to.have.lengthOf(3)
  })


  it("mltpl", () => {
    expect(9).to.be.a("number")
    expect(9).to.equal( mltpl(3)(3) )
    expect(27).to.equal( mltpl(9)(3) )
    expect(27).to.equal( 9 *3 )
  })

  it("divsn", () => {
    expect(divsn(5)(5)).to.be.a("number")
    expect(divsn(5)(5)).to.equal( 5/5 )
    expect(divsn(5)(5)).to.not.equal( 5/4 )
  })

  //});
})
