const appName = "traceless"
const publishFolderName = "pkg"
const baseUrl = `https://raw.githubusercontent.com/tracelessman/traceless/publish/${publishFolderName}/`

module.exports = {
    apkUrl:`${baseUrl+appName}.apk`,
    updateJsonUrl:`${baseUrl}update.json`,
    appName,
    publishFolderName,
    ipaUrl:`${baseUrl}manifest.plist`,
    ppkUrl:`${baseUrl+appName}.ppk`
}
