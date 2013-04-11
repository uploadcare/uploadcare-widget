# = require application

describe "Uploadcare", ->
  
  it "window.uploadcare should be defined", ->
    expect(window.uploadcare).toBeDefined()
