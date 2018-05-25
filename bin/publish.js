let  node_ssh, ssh, fs

fs = require('fs')
node_ssh = require('node-ssh')
ssh = new node_ssh()
const path = require('path')
const crypto = require('crypto')
const childProcess = require('child_process')



const localApkPath = path.resolve(__dirname,'../android/app/build/outputs/apk/app-release.apk')
const algorithm =  crypto.createHash('md5')
let hashValue = algorithm.update(fs.readFileSync(localApkPath)).digest('hex')
let updateInfo = {
    hash:hashValue,
    version:require('../package.json').version
}
const localUpdatePath = __dirname+'/update.json'
fs.writeFileSync(localUpdatePath,JSON.stringify(updateInfo),'utf8')
