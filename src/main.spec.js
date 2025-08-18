describe('main.js', () => {
  it('exists as entry point', () => {
    const fs = require('fs')
    const path = require('path')
    const mainPath = path.resolve(__dirname, 'main.js')
    expect(fs.existsSync(mainPath)).toBe(true)
  })

  it('is a JavaScript file', () => {
    const fs = require('fs')
    const path = require('path')
    const mainPath = path.resolve(__dirname, 'main.js')
    const content = fs.readFileSync(mainPath, 'utf8')
    expect(content).toContain('createApp')
    expect(content).toContain('mount')
  })
})