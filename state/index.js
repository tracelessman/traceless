const netInfoUtil = require("../util/netInfoUtil")
const state = {
    isDev:false,
    init(){
        netInfoUtil.webConnet(()=>{
            fetch()
        })
    }
}



module.exports = state
