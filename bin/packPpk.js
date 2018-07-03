const childProcess = require('child_process')
const devConfig = require('../config/devConfig')

const start = Date.now()
console.log('ppk export started')

childProcess.execSync(`pushy bundle --platform ios --output ${devConfig.exportPpkFolderPath}/${devConfig.appName}.ppk`)

console.log('ppk export end')
console.log(`time elapsed ${(Date.now()-start)/1000} s`)
