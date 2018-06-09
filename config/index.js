const appName = "traceless"
const publishFolderName = "pkg"
const publishBranch = 'publishTest'
const baseUrl = `https://raw.githubusercontent.com/tracelessman/traceless/${publishBranch}/${publishFolderName}/`

module.exports = {
    apkUrl:`${baseUrl+appName}.apk`,
    updateJsonUrl:`${baseUrl}update.json`,
    appName,
    publishFolderName,
    ipaUrl:`${baseUrl}manifest.plist`,
    ppkUrl:`${baseUrl+appName}.ppk`,
    publishBranch
}
