const appName = "traceless"
const publishFolderName = "pkg"
const publishBranch = 'publish'
const baseUrl = `https://raw.githubusercontent.com/tracelessman/traceless/${publishBranch}/${publishFolderName}/`
const diffConfig = require('./diffConfig')
const port = 3000
const protocol = "http"
const RNFS = require('react-native-fs')

const url = `${protocol}://${diffConfig.host}:${port}`
const config = {
    appId:"traceless",
    appName,
    publishFolderName,
    publishBranch,
    spiritUid:"aa45eeb9-bb74-4c01-870d-39d8e7110c29",
    url,
    devLogPath:RNFS.DocumentDirectoryPath + '/devLog.txt',
    errorLogPath:RNFS.DocumentDirectoryPath + '/errorLog.txt',
}

config.checkUpdateUrl = `${config.url}/checkUpdateGeneral`


module.exports = {
    ...config,...diffConfig
}
