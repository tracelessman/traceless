const appName = "traceless"
const publishFolderName = "pkg"
const publishBranch = 'publish'
const baseUrl = `https://raw.githubusercontent.com/tracelessman/traceless/${publishBranch}/${publishFolderName}/`
const diffConfig = require('./diffConfig')
const port = 3000
const protocol = "http"
const RNFS = require('react-native-fs')


const config = {
    apkUrl:`${baseUrl+appName}.apk`,
    updateJsonUrl:`${baseUrl}update.json`,
    appName,
    publishFolderName,
    ipaUrl:`${baseUrl}manifest.plist`,
    ppkUrl:`${baseUrl+appName}.ppk`,
    publishBranch,
    spiritUid:"aa45eeb9-bb74-4c01-870d-39d8e7110c29",
    url:`${protocol}://${diffConfig.host}:${port}`,
    devLogPath:RNFS.DocumentDirectoryPath + '/devLog.txt',
    errorLogPath:RNFS.DocumentDirectoryPath + '/errorLog.txt'
}

config.checkUpdateUrl = `${config.url}/checkUpdateGeneral`


module.exports = {
    ...config,...diffConfig
}
