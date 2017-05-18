const hyperdrive = require('hyperdrive')
// const mirror     = require('mirror-folder')
const http       = require('http')
const serve      = require('hyperdrive-http')
const discovery  = require('hyperdiscovery')
const request    = require('request')
const electron   = require('electron')
const path       = require('path')
const mkdirp     = require('mkdirp')
const portfinder = require('portfinder')

const servers = []

const appDataPath = path.join(electron.app.getPath('appData'), 'p2phls')

function poll(url, cb) {
  request.head(url, function (error, response) {
    if (error || !response || response.statusCode !== 200) {
      return poll(url, cb)
    }

    cb()
  });
}

function getPort() {
  portfinder.basePort = 10000
  return portfinder.getPortPromise()
}

function mkfolder(key) {
  return new Promise((resolve, reject) => {
    const folder = path.join(appDataPath, key)
    mkdirp(folder, (err) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(folder)
      }
    })
  })
}

function createDrive(folder, key) {
  return new Promise((resolve) => {
    const drive = hyperdrive(folder, key, {sparse: true})
    drive.on('ready', () => resolve(drive))
  })
}

function checkSrc(src) {
  return new Promise((resolve) => {
    poll(src, resolve)
  })
}

function closeServer(server) {
  try {
    server.close()
  } catch (e) {
    console.error(e)
  }
}

async function createServer(key) {
  const folder = await mkfolder(key)
  const drive  = await createDrive(folder, key)
  const port   = await getPort()

  const server = http.createServer(serve(drive))
  server.listen(port)
  discovery(drive, {live: true})

  // TODO: close existing running server
  servers.push(server)

  const src = `http://localhost:${port}/master.m3u8`
  await checkSrc(src)

  console.log(`hyperdrive for key: <${key}> running on: <http://localhost:${port}>`)
  return {server, port, src}
}

process.on('exit', () => {
  servers.forEach(closeServer)
})


module.exports = {
  createServer
}
