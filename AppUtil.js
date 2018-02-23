/**
 * Created by renbaogang on 2017/11/3.
 */
var AppUtil={
    setApp:function (app) {
        this.app = app;
    },
    reset:function (target) {
        this._target = target;
        this.app.reset();
    },
    getResetTarget:function () {
        return this._target;
    },
    clearResetTarget:function () {
        delete this._target;
    },
    isFreeRegister:function () {
        return true;
    }
};
export default AppUtil;