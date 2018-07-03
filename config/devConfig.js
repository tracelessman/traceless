const path = require('path')
const rootPath = path.resolve(__dirname,'../')
const devDiffConfig = require("./devDiffConfig")
const fs = require('fs')
const devConfig = {
    ...JSON.parse(fs.readFileSync(path.resolve(__dirname,'common.json'),"utf8").trim()),
    ...devDiffConfig,
    localIpaFolderPath:path.resolve(rootPath,'pkg'),
    exportIpaFolderPath:path.resolve(devDiffConfig.localServerPublicFolderPath,"pkg/ios"),
    exportPpkFolderPath:path.resolve(devDiffConfig.localServerPublicFolderPath,"pkg/ppk"),
    exportAndroidFolderPath:path.resolve(devDiffConfig.localServerPublicFolderPath,"pkg/android"),
}
console.log(devConfig)

module.exports = devConfig
