const path = require('path')
const rootPath = path.resolve(__dirname,'../')
const devDiffConfig = require("./devDiffConfig")
const fs = require('fs')
const fse = require('fs-extra')

const isPreviewVersion  = false


const middlePath = isPreviewVersion?"preview/":""
const devConfig = {
    ...JSON.parse(fs.readFileSync(path.resolve(__dirname,'common.json'),"utf8").trim()),
    ...devDiffConfig,
    localIpaFolderPath:path.resolve(rootPath,'pkg'),
    exportIpaFolderPath:path.resolve(devDiffConfig.localServerPublicFolderPath,`pkg/${middlePath}ios`),
    exportPpkFolderPath:path.resolve(devDiffConfig.localServerPublicFolderPath,`pkg/${middlePath}ppk`),
    exportAndroidFolderPath:path.resolve(devDiffConfig.localServerPublicFolderPath,`pkg/${middlePath}android`),
}
console.log(devConfig)

fse.ensureDirSync(devConfig.exportIpaFolderPath)
fse.ensureDirSync(devConfig.exportPpkFolderPath)
fse.ensureDirSync(devConfig.exportAndroidFolderPath)
fse.ensureDirSync(devConfig.localIpaFolderPath)

module.exports = devConfig
