
const fs = require('fs')
const node_ssh = require('node-ssh')
const ssh = new node_ssh()
const path = require('path')
const rootPath = path.resolve(__dirname,'../')
const crypto = require('crypto')
const config = require(rootPath,'config')

const start = Date.now()

let config = {
    host:'192.144.172.30',
    username: 'root',
    password: 'abc@147258369'
}
ssh.connect(config).then(()=>{
    const localIpaFolderPath = config.localIpaFolderPath
    const algorithm =  crypto.createHash('md5')
    let hashValue = algorithm.update(fs.readFileSync(localApkPath)).digest('hex')
    let updateInfo = {
        hash:hashValue,
        version:require('../package.json').version
    }
    const localUpdatePath = __dirname+'/update.json'
    fs.writeFileSync(localUpdatePath,JSON.stringify(updateInfo),'utf8')

    const fileAry = [{
        local:localApkPath,remote:'/opt/traceless-transfer/public/pkg/traceless.apk'
    },{
        local:localUpdatePath,remote:'/opt/traceless-transfer/public/pkg/update.json'
    }]
    ssh.putFiles(fileAry).then(function() {
        ssh.execCommand('md5sum traceless.apk', { cwd:'/opt/traceless-transfer/public/pkg' }).then(function(result) {
            if(result.stderr){
                console.log('STDOUT: ' + result.stdout)
                console.log('STDERR: ' + result.stderr)
            }else{
                let remoteHashValue = result.stdout.split(' ')[0]
                if(remoteHashValue === hashValue){
                    console.log('apk uploaded successfully')
                    console.log(`time elapsed is ${(Date.now()-start)/1000} s`)
                    fs.unlink(localUpdatePath,(err)=>{
                        console.log(err)
                    })
                    process.exit()
                }else{
                    throw new Error('apk uploading failed')
                }
            }
        })

    }, function(error) {
        console.log("Something's wrong")
        console.log(error)
    })
})


