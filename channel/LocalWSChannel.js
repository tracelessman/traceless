/**
 * Created by renbaogang on 2017/10/28.
 */
import Store from "../store/Store";
import RSAKey from 'react-native-rsa';
var WSChannel = require("./WSChannel");
WSChannel._getRSAInstance = function() {
    if(!this._RSAInstance){
        this._RSAInstance = new RSAKey();
        this._RSAInstance.setPublicString(Store.getPublicKey());
        this._RSAInstance.setPrivateString(Store.getPrivateKey());
    }
    return this._RSAInstance;
}
WSChannel.encrypt = function (text) {
    var rsa = this._getRSAInstance();
    return rsa.encrypt(text);
}
WSChannel.decrypt = function (encrypted) {
    var rsa = this._getRSAInstance();
    var de = rsa.decrypt(encrypted);
    if(de===undefined||de==null){
        return "无法解密的密文";
    }
    return de;
}
export default WSChannel;