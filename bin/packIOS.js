const path = require('path')
const rootPath = path.resolve(__dirname,'../')
const childProcess = require('child_process')
const start = Date.now()
const uuid = require('uuid/v4')
const fs = require('fs')
const fse = require('fs-extra')
const buildFolderPath = path.resolve(rootPath,"build")
fse.ensureDirSync(buildFolderPath)
const archivePath = path.resolve(buildFolderPath,"tmp")
// const devConfig = require(rootPath,'config/devConfig')
const {argv} = require('yargs')
let {scheme,archive} = argv
const schemeAry = ['traceless','traceless-dev','traceless-test']
const devConfig = require('../config/devConfig')

if(!scheme || !schemeAry.includes(scheme)){
    scheme = 'traceless'
}
console.log(`scheme : ${scheme}`)

if(archive){
    console.log('archive ios ....')
    childProcess.execSync(`
    cd ios && xcodebuild  -allowProvisioningUpdates  archive -scheme ${scheme} -archivePath "${archivePath}"
`)
    timeLog()
}


console.log('archive success')

const exportPath = devConfig.exportIpaFolderPath
fse.ensureDirSync(exportPath)

const exportOptionsPath = path.resolve(rootPath,'ios/ExportOptions.plist')
childProcess.execSync(`
    xcodebuild -exportArchive  -allowProvisioningUpdates  -archivePath "${archivePath}.xcarchive" -exportPath "${exportPath}" -exportOptionsPlist '${exportOptionsPath}'
`)

console.log('ipa generated successfully')

fs.renameSync(path.resolve(exportPath,`${devConfig.appId}.ipa`),path.resolve(exportPath,`${devConfig.appName}.ipa`))
timeLog()

function timeLog(){
    let timeInS = Math.floor((Date.now()-start)/1000)
    console.log(`time elapsed ${Math.floor(timeInS / 60)}m${timeInS % 60}s`)

}
