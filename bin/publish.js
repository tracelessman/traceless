let  node_ssh, ssh, fs

fs = require('fs')
node_ssh = require('node-ssh')
ssh = new node_ssh()
const path = require('path')
const crypto = require('crypto')
const childProcess = require('child_process')
const start = Date.now()

childProcess.execSync(`
    git checkout publish
`)
const localApkPath = path.resolve(__dirname,'../android/app/build/outputs/apk/app-release.apk')
const algorithm =  crypto.createHash('md5')
let hashValue = algorithm.update(fs.readFileSync(localApkPath)).digest('hex')
const version = require('../package.json').version
let updateInfo = {
    hash:hashValue,
    version
}
const localUpdatePath = __dirname+'/update.json'
fs.writeFileSync(localUpdatePath,JSON.stringify(updateInfo),'utf8')
childProcess.exec(`
    npm run pack:android && git commit -am "${version} @${new Date()}" && git push
`,(error,stdout,stderr)=>{
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.log(`stderr: ${stderr}`);
    console.log(`time elapsed ${(Date.now()-start)/1000} s`)
    
})
