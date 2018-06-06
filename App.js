
import React, { Component } from 'react';
import {
    AsyncStorage,
    NativeModules,
    Platform,
    StyleSheet,Text,
    View
} from 'react-native';
import LoginView from "./index/LoginView"
import Store from "./store/LocalStore"
import AppUtil from "./AppUtil"
import MainView from "./index/MainView";
import WSChannel from './channel/LocalWSChannel';
import ScanRegisterView from './index/ScanRegisterView';
import {Toast} from "native-base";

console.ignoredYellowBox = ['Setting a timer','Remote debugger']


export default class App extends Component<{}> {



    constructor(props){
        super(props);
        this.state={};
        AppUtil.setApp(this);
        this.seed=0;
    }

    componentDidMount=()=>{
        this.try2Login();
        Store.on("uidChanged",this._onSystemNotify);
        WSChannel.on("badnetwork",()=>{
            Toast.show({
                text: '无法连接服务器,请检查网络连接',
                position: "top",
                type:"warning",
                duration: 5000
            })
        })
    }

    _onSystemNotify=(uid)=>{
        if(uid){
            if(Platform.OS === 'android'){
                let tag = uid.replace(/\-/gi, '');
                AppUtil.setJpush({
                    clickHandler(msg){
                        if(msg.targetUid==Store.getCurrentUid()){
                            AppUtil.reset({view:"ChatView",param:{friend:Store.getFriend(msg.fromUid)}});
                        }
                    },
                    tag
                }).then((result)=>{
                    const {registrationId} = result

                }).catch(err=>{
                    console.log(err)
                })
            }
        }
    }

    componentWillUnmount =()=> {
        Store.un("uidChanged",this._onSystemNotify);
    }

    reset=(t)=>{
        this.seed++;
        if(Store.getLoginState())
            {this.setState({reset:true});}
        else
            {this.try2Login();}
    }

    try2Login=()=>{
        Store.fetchAllKeys((data)=>{
            if(data&&data.length>0){
                let cur = data[0];
                //登录
                this.setState({data,logining:true});
                WSChannel.login(cur.name,cur.id,cur.clientId,cur.server,(msg)=>{
                    this.seed++;
                    if(!msg.err){
                        // Store.setCurrentUid(cur.id) ;
                        this.setState({data,logining:false});
                    }else{
                        this.setState({data,logining:false});
                    }

                },()=> {
                    this.seed++;
                    WSChannel._fire("badN")
                    this.setState({data,logining:false});
                });
            }else{
                //null 需注册
                this.setState({data:null});
            }
        });
    }

    render() {
        //console.info(this.state.key);
        let content=null;
        if(Store.getLoginState()){
            content = <MainView key={this.seed} />
        }else if(this.state.data){
            content=<LoginView key={this.seed} data={this.state.data} logining={this.state.logining}></LoginView>;
        }else if(this.state.data===null){
            content=<ScanRegisterView key={this.seed}></ScanRegisterView>
        }else{
            content = <Text style={{textAlign:"center",marginTop:"50%"}}>loading...</Text>
        }

        return (
            <View style={styles.container}>
                {content}
            </View>
        );
    }

}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    welcome: {
        fontSize: 20,
        textAlign: 'center',
        margin: 10,
    },
    instructions: {
        textAlign: 'center',
        color: '#333333',
        marginBottom: 5,
    },
});
