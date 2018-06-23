/* eslint-disable */
import Store from "../store/Store";
import RSAKey from 'react-native-rsa';
import UUID from 'uuid/v4';
import CryptoJS from "crypto-js";
var WSChannel = require("./WSChannel");
WSChannel._getRSAInstance = function() {
    if(!this._RSAInstance||this._uid!=Store.getCurrentUid()){
        this._RSAInstance = new RSAKey();
        this._RSAInstance.setPublicString(Store.getPublicKey());
        this._RSAInstance.setPrivateString(Store.getPrivateKey());
        this._uid = Store.getCurrentUid();
    }
    return this._RSAInstance;
}
WSChannel.encrypt = function (text,pk) {
    // var rsa = new RSAKey();
    // rsa.setPublicString(pk);
    // return rsa.encrypt(text);
    var s= CryptoJS.AES.encrypt(text, '999').toString();
    return s;
}
WSChannel.decrypt = function (encrypted) {
    // var rsa = this._getRSAInstance();
    // var de = rsa.decrypt(encrypted);
    // if(de===undefined||de==null){
    //     return "无法解密的密文";
    // }
    // return de;
    if(encrypted){
        try{
            var bytes  = CryptoJS.AES.decrypt(encrypted.toString(), '999');
            return bytes.toString(CryptoJS.enc.Utf8);
        }catch(e){
            return encrypted;
        }

    }
    return "";
}
WSChannel._msgIndex = 0;
WSChannel.generateMsgId = function () {
    var s = this.seed+"0"+this._msgIndex;
    this._msgIndex++;
    return parseInt(s);
}
export default WSChannel;
