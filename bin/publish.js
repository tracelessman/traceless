let  node_ssh, ssh, fs

fs = require('fs')
node_ssh = require('node-ssh')
ssh = new node_ssh()
const path = require('path')
const crypto = require('crypto')
const childProcess = require('child_process')
const start = Date.now()
const argv = require('yargs').argv
const axios = require('axios')
const fse = require('fs-extra')
const config = require('../config')
const {updateJsonUrl,apkUrl} = config


childProcess.execSync(`
    git checkout publish
`)
const localApkPath = path.resolve(__dirname,'../android/app/build/outputs/apk/app-release.apk')
if(argv.p || !fs.existsSync(localApkPath)){
    console.log('packing apk ..................')
    childProcess.execSync(`
        npm run pack:android
    `)
}
const publishFolderPath = path.resolve(__dirname,'../publish')
fse.ensureDirSync(publishFolderPath)
fse.copySync(localApkPath,path.resolve(publishFolderPath,'traceless.apk'))


const algorithm =  crypto.createHash('md5')
let hashValue = algorithm.update(fs.readFileSync(localApkPath)).digest('hex')
const version = require('../package.json').version
let updateInfo = {
    hash:hashValue,
    version
}
const localUpdatePath = path.resolve(publishFolderPath,'update.json')
fs.writeFileSync(localUpdatePath,JSON.stringify(updateInfo),'utf8')


let cmd = `
     git add publish && git commit -am "${version} @${new Date()}" && git push
`

childProcess.exec(cmd,(error,stdout,stderr)=>{
    if (error) {
        console.error(`exec error: ${error}`);
        return;
    }

    validate(stdout,stderr)

})

function validate(stdout,stderr){
    axios.get(apkUrl).then( (res)=> {
      // 'status', 'statusText', 'headers',
          if(res.status !== 200){
            console.error('error!!!!!!!!!')
            console.log(res.status)
            console.log(res.statusText)
            console.log(res.headers)
          }else{
            console.log(`stdout: ${stdout}`);
            console.log(`${stderr}`);
            console.log(`time elapsed ${(Date.now()-start)/1000} s`)
          }

        }).catch(err=>{
          console.error('error!!!!!!!!!')
          throw err
        })
}