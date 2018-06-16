const path = require('path')
const rootPath = path.resolve(__dirname,'../')
const childProcess = require('child_process')
const start = Date.now()
const uuid = require('uuid/v4')
const fse = require('fs-extra')
const archivePath = path.resolve(rootPath,"build/tmp")


console.log('archive ios ....')
childProcess.execSync(`
    cd ios && xcodebuild archive -scheme traceless -archivePath "${archivePath}"
`)
timeLog()

console.log('archive success')

const exportPath = path.resolve(rootPath,"pkg")
fse.ensureDirSync(exportPath)

const exportOptionsPath = path.resolve(rootPath,'ios/ExportOptions.plist')
childProcess.execSync(`
    xcodebuild -exportArchive -archivePath "${archivePath}.xcarchive" -exportPath "${exportPath}" -exportOptionsPlist '${exportOptionsPath}'
`)

console.log('ipa generated successfully')

timeLog()

function timeLog(){
    console.log(`time elapsed ${(Date.now()-start)/1000} s`)

}