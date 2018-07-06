const location = "server"

const hostObj  = {
    office:"172.18.1.181",
    server:"192.144.172.30",
    home:"192.168.1.101",

}


const diffConfig  = {
    host:hostObj[location],
    previewVersion:"0.0.1",
    hostObj
}
diffConfig.isPreviewVersion = Boolean(diffConfig.previewVersion)

module.exports = diffConfig
