const appName = "LK"
const publishFolderName = "pkg"
const baseUrl = `https://github.com/tracelessman/traceless/raw/publish/${publishFolderName}/`

module.exports = {
    apkUrl:`${baseUrl+appName}.apk`,
    updateJsonUrl:`${baseUrl}update.json`,
    appName,
    publishFolderName
}
