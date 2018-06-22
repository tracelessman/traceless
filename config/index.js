const appName = "traceless"
const publishFolderName = "pkg"
const publishBranch = 'publish'
const baseUrl = `https://raw.githubusercontent.com/tracelessman/traceless/${publishBranch}/${publishFolderName}/`

module.exports = {
    apkUrl:`${baseUrl+appName}.apk`,
    updateJsonUrl:`${baseUrl}update.json`,
    appName,
    publishFolderName,
    ipaUrl:`${baseUrl}manifest.plist`,
    ppkUrl:`${baseUrl+appName}.ppk`,
    publishBranch,
    spiritUid:"aa45eeb9-bb74-4c01-870d-39d8e7110c29"
}
