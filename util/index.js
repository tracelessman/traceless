const _ = require('lodash')
const util = {}
const jsAry = [
    require('./commonUtil'),
    require("./devUtil"),
    require("./errorReportUtil"),
    require("./netInfoUtil"),
    require("./pushUtil"),
    require("./updateUtil")
]
//TODO: util should have no data binded
for(const obj of jsAry){
    _.merge(util,obj)
}

module.exports = util
