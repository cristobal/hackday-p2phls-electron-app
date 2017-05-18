// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.
const {ipcRenderer} = require('electron')
ipcRenderer.on('seed-port', (event, port) => {
  console.log('got seed port', port)
  setupVideoJs(port)
})


//--------------------------------------
//  Player Seed logic
//--------------------------------------
const REQUIRED_SEED_LENGTH = 64
let loading = false
document.querySelector('.player-seed form button').addEventListener('click',
 (event) => {
   // TODO: add value validator
   // TODO: add spinner indicating loading
   const {value} = document.querySelector('.player-seed form input')

   if (value.length !== REQUIRED_SEED_LENGTH) {
     alert('Not an valid seed')
     return
   }

   if (loading) {
     console.log('already loading an key')
    return
   }

   ipcRenderer.send('seed-key', value)
 })
