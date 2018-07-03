const appName = "LK"
const publishFolderName = "pkg"
const publishBranch = 'publish'
const baseUrl = `https://raw.githubusercontent.com/tracelessman/traceless/${publishBranch}/${publishFolderName}/`
const diffConfig = require('./diffConfig')
const port = 3000
const protocol = "http"
const RNFS = require('react-native-fs')
import { NetworkInfo } from 'react-native-network-info';


const config = {
    appId:"traceless",
    appName,
    publishFolderName,
    publishBranch,
    spiritUid:"aa45eeb9-bb74-4c01-870d-39d8e7110c29",
    devLogPath:RNFS.DocumentDirectoryPath + '/devLog.txt',
    errorLogPath:RNFS.DocumentDirectoryPath + '/errorLog.txt',
    isDevMode:true,
    ...diffConfig
}
setUrl(diffConfig.host)




module.exports = config

function setUrl(serverIp){
    config.url = `${protocol}://${serverIp}:${port}`
    config.checkUpdateUrl = `${config.url}/checkUpdateGeneral`
}
