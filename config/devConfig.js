const path = require('path')
const rootPath = path.resolve(__dirname,'../')
const devDiffConfig = require("./devDiffConfig")

const devConfig = {
    ...devDiffConfig,
    appId:"traceless",
    appName:"LK",
    localIpaFolderPath:path.resolve(rootPath,'pkg'),
    exportIpaFolderPath:path.resolve(devDiffConfig.localServerPublicFolderPath,"pkg/ios"),
    exportPpkFolderPath:path.resolve(devDiffConfig.localServerPublicFolderPath,"pkg/ppk"),
    exportAndroidFolderPath:path.resolve(devDiffConfig.localServerPublicFolderPath,"pkg/android"),
    publishBranch:"publish",
}
module.exports = devConfig
