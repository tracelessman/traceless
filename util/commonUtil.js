const commonUtil = {
    getTimeDisplay: function () {
        const date = new Date();
        return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
    },
    runFunc(func){
        if(func){
            func()
        }
    }
}

module.exports = commonUtil
