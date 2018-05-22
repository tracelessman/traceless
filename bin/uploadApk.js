var  node_ssh, ssh, fs

fs = require('fs')
node_ssh = require('node-ssh')
ssh = new node_ssh()
const path = require('path')
const crypto = require('crypto')

const start = Date.now()

ssh.connect({
    host: '123.207.145.167',
    username: 'root',
    password: 'proxy@hfs'
}).then(()=>{
    const localApkPath = path.resolve(__dirname,'../android/app/build/outputs/apk/app-release.apk')
    const algorithm =  crypto.createHash('md5')
    let hashValue = algorithm.update(fs.readFileSync(localApkPath)).digest('hex')

    ssh.putFile(localApkPath ,'/opt/traceless-transfer/public/pkg/traceless.apk').then(function() {
        ssh.execCommand('md5sum traceless.apk', { cwd:'/opt/traceless-transfer/public/pkg' }).then(function(result) {
            if(result.stderr){
                console.log('STDOUT: ' + result.stdout)
                console.log('STDERR: ' + result.stderr)
            }else{
                let remoteHashValue = result.stdout.split(' ')[0]
                if(remoteHashValue === hashValue){
                    console.log('apk uploaded successfully')
                    console.log(`time elapsed is ${(Date.now()-start)/1000} s`)
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
