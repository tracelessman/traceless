/**
 * Created by renbaogang on 2017/11/3.
 */

import React, { Component } from 'react';
import {
    Text,
    View,
    TextInput,
    ScrollView,
    Button,
    Image,
    TouchableOpacity,Modal,Keyboard,Animated,Platform,Dimensions,WebView
} from 'react-native';
import Store from "../store/LocalStore";
import WSChannel from "../channel/LocalWSChannel";
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'react-native-fetch-blob';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppUtil from "../AppUtil"

export default class ChatView extends Component<{}> {
    static navigationOptions =({ navigation, screenProps }) => (

        {
            headerTitle: navigation.state.params.friend?navigation.state.params.friend.name:navigation.state.params.group.name,
            headerRight:<TouchableOpacity  onPress={()=>{navigation.navigate("GroupInfoView",{group:navigation.state.params.group})}}
                                          style={{marginRight:20}}><Image source={require('../images/group.png')} style={{width:navigation.state.params.group?22:0,height:22}} resizeMode="contain"></Image></TouchableOpacity>,

        }
    );


    constructor(props){
        super(props);
        this.state={biggerImageVisible:false,heightAnim: 0};
        this.isGroupChat = this.props.navigation.state.params.group?true:false;

        this.otherSide = this.props.navigation.state.params.friend||this.props.navigation.state.params.group;
        this.text="";

        this._keySeed = 0;
    }

    refreshRecordList=()=>{
        if(this.isGroupChat){
            Store.readGroupChatRecords(this.otherSide.id,false,this._getRecords);
        }else{
            Store.readAllChatRecords(this.otherSide.id,false,this._getRecords);
        }
    }

    _getRecords=(rec)=>{
        this.records = rec;
        this.setState({messageChange:true});
    }

    _keyboardDidShow=(e)=>{
        let keyY = e.endCoordinates.screenY;
        this.setState({heightAnim:Dimensions.get('window').height-keyY});
        // if(Platform.OS=="ios"){
        //     this.setState({marignBAnim:Dimensions.get('window').height-keyY});
            // Animated.timing(
            //     this.state.marignBAnim,
            //     {
            //         toValue: Dimensions.get('window').height-keyY,
            //         duration: 50
            //     }
            // ).start();
        // }


    }
    _keyboardDidHide=(e)=>{
        this.setState({heightAnim:0});
        // if(Platform.OS=="ios"){
        //     this.setState({marginTAnim:0});
        //     this.setState({marignBAnim:0});
            // Animated.timing(
            //     this.state.marignBAnim,
            //     {
            //         toValue: 0,
            //         duration: 50
            //     }
            // ).start();
        // }

    }

    onReceiveMessage=(fromId)=>{
        if(fromId==this.otherSide.id){
            this.refreshRecordList();
        }

    }

    onSendMessage=(targetId)=>{
        if(targetId==this.otherSide.id){
            this.refreshRecordList();
        }
    }

    componentWillMount =()=> {
        Store.on("receiveMessage",this.onReceiveMessage);
        Store.on("sendMessage",this.onSendMessage);
        Store.on("updateMessageState",this.onSendMessage);
        Store.on("updateGroupMessageState",this.onSendMessage);
        Store.on("receiveGroupMessage",this.onReceiveMessage);
        Store.on("sendGroupMessage",this.onSendMessage);

        if(Platform.OS==="ios"){
            this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this._keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this._keyboardDidHide);
        }else{
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        }
    }

    componentWillUnmount =()=> {
        Store.un("receiveMessage",this.onReceiveMessage);
        Store.un("sendMessage",this.onSendMessage);
        Store.un("updateMessageState",this.onSendMessage);
        Store.un("updateGroupMessageState",this.onSendMessage);
        Store.un("receiveGroupMessage",this.onReceiveMessage);
        Store.un("sendGroupMessage",this.onSendMessage);

        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }


    textChange=(v)=>{
        this.text = v;
    }

    componentDidMount=()=>{
        this.refreshRecordList();
       setTimeout(()=>{
           this.refs["scrollView"].scrollToEnd();
       },50)
    }

    componentDidUpdate=()=>{
        this.refs["scrollView"].scrollToEnd();
    }

    send=()=>{
        if(this.text){
            if(this.isGroupChat){
                WSChannel.sendGroupMessage(this.otherSide.id,this.otherSide.name,this.text,()=>{
                    this.text="";
                    this.refs["text"].clear();
                    this.refs["scrollView"].scrollToEnd();
                });
            }else{
                WSChannel.sendMessage(this.otherSide.id,this.text,()=>{
                    this.text="";
                    this.refs["text"].clear();
                    this.refs["scrollView"].scrollToEnd();
                });


            }
        }


    }

    sendImage=(data)=>{
        if(this.isGroupChat){
            WSChannel.sendGroupImage(this.otherSide.id,this.otherSide.name,data,()=>{
                this.refs["scrollView"].scrollToEnd();
            });
        }else{
            WSChannel.sendImage(this.otherSide.id,data,()=>{
                this.refs["scrollView"].scrollToEnd();
            });
        }

    }

    showImagePicker=()=>{
        var options = {
            title: '选择图片',
            cancelButtonTitle: '取消',
            takePhotoButtonTitle: '拍照',
            chooseFromLibraryButtonTitle: '图片库',
            mediaType:'photo',
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };

        ImagePicker.showImagePicker(options, (response) => {


            if (response.didCancel) {
            }
            else if (response.error) {
            }
            else if (response.customButton) {
            }
            else {
                var imageUri = response.uri;
                var img = {data:response.data,width:response.width,height:response.height}
                this.sendImage(img);

                 // if(response.fileSize>1*1024*1024){


                    // ImageResizer.createResizedImage(imageUri, 800, 800, "JPEG", 60, 0, null).then((res) => {
                    //     RNFetchBlob.fs.readFile(res.path,'base64').then((data)=>{
                    //         // let source = { uri: 'data:image/jpeg;base64,' + data ,width:400,height:400};
                    //         // console.info("send img:"+'data:image/jpeg;base64,' + data);
                    //         // this.sendImage(imageUri,'data:image/jpeg;base64,' + data);
                    //         this.sendImage('data:image/jpeg;base64,' + data);
                    //         // this.setState({
                    //         //     avatarSource: source
                    //         // });
                    //     });
                    // }).catch((err) => {
                    // });
                // }else{
                //      this.sendImage(imageUri,'data:image/jpeg;base64,' + response.data);
                // }

                // // let source = { uri: response.uri,data:"data:image/jpg;base64,"+response.data };
                // let source = { uri: 'data:image/png;base64,' + response.data ,width:response.width,height:response.height,type:response.fileName.substring(response.fileName.lastIndexOf("."))};
                //
                // console.info(JSON.stringify(source));
                // this.setState({
                //     avatarSource: source
                // });
                // // this.readFile(source.uri);
            }
        });
    }

    showBiggerImage=function () {
        this.chatView.setState({biggerImageVisible:true,biggerImageUri:this.imgUri});
    }

    getIconNameByState=function (state) {
        if(state===0){
            return "md-arrow-round-up";
        }else if(state===1){
            return "md-refresh";
        }else if(state===2){
            return "md-checkmark-circle-outline";
        }else if(state===3){
            return "ios-checkmark-circle-outline";
        }else if(state===4){
            return "ios-mail-open-outline";
        }else if(state===5){
            return "ios-bonfire-outline";
        }
        return "ios-help"
    }

    doTouchMsgState=function () {
        if(this.ChatView.isGroupChat){
            Store.getGroupChatRecord(this.ChatView.otherSide.id,this.msgId,null,(rec)=>{
                if(rec){
                    if(rec.state==Store.MESSAGE_STATE_SERVER_NOT_RECEIVE){
                        if(rec.type==Store.MESSAGE_TYEP_TEXT){
                            WSChannel.resendGroupMessage(rec.msgId,this.ChatView.otherSide.id,this.ChatView.otherSide.name,rec.content);
                        }else if(rec.type==Store.MESSAGE_TYPE_IMAGE){
                            WSChannel.resendGroupImage(rec.msgId,this.ChatView.otherSide.id,this.ChatView.otherSide.name,JSON.parse(rec.content))
                        }
                    }else{
                        this.ChatView.props.navigation.navigate("GroupMsgStateView",{gid:this.ChatView.otherSide.id,msgId:this.msgId});
                    }
                }
            });

        }else{
            Store.getRecentChatRecord(this.ChatView.otherSide.id,this.msgId,null,(rec)=>{
                if(rec&&rec.state==Store.MESSAGE_STATE_SERVER_NOT_RECEIVE){
                    if(rec.type==Store.MESSAGE_TYEP_TEXT)
                        WSChannel.resendMessage(rec.msgId,this.ChatView.otherSide.id,rec.content);
                    else if(rec.type==Store.MESSAGE_TYPE_IMAGE)
                        WSChannel.resendImage(rec.msgId,this.ChatView.otherSide.id,JSON.parse(rec.content))
                }
            });


        }
    }

    _getMessage=(rec)=>{
        if(rec.type==Store.MESSAGE_TYEP_TEXT){
            return <Text>{rec.content}</Text>;

        }else if(rec.type==Store.MESSAGE_TYPE_IMAGE) {
            var img = JSON.parse(rec.content);
            var imgUri = img;
            var imgW = 180;
            var imgH = 180;
            if(img&&img.data){
                imgUri = "file://"+img.data;
                //imgW = img.width;
                //imgH = img.height;
            }
           return <TouchableOpacity chatView={this} imgUri={imgUri} onPress={this.showBiggerImage}><Image source={{uri:imgUri}} style={{width:imgW,height:imgH}} resizeMode="contain"/></TouchableOpacity>;
        }else if(rec.type==Store.MESSAGE_TYPE_FILE){
            var file = JSON.parse(rec.content);
            return <TouchableOpacity><Ionicons name="ios-document-outline" size={40}  style={{marginRight:5,lineHeight:40}}></Ionicons><Text>{file.name}(请在桌面版APP里查看)</Text></TouchableOpacity>;
        }
    }

    render() {
       var records = this.records;
       var recordEls = [];
       if(records){
           var lastSpTime;
           var picSource = AppUtil.getAvatarSource(Store.getPersonalPic());
           var now = new Date();
           for(var i=0;i<records.length;i++){
               if(lastSpTime&&records[i].time-lastSpTime>10*60*1000||!lastSpTime){
                   lastSpTime = records[i].time;
                   if(lastSpTime){
                       var timeStr="";
                       var date = new Date();
                       date.setTime(lastSpTime);
                       if(now.getFullYear()==date.getFullYear()&&now.getMonth()==date.getMonth()&&now.getDate()==date.getDate()){
                           timeStr+="今天 ";
                       }else if(now.getFullYear()==date.getFullYear()){
                           timeStr+=(date.getMonth()+1)+"月"+date.getDate()+"日 ";
                       }
                       timeStr+=date.getHours()+":"+(date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes());
                       recordEls.push(<Text style={{marginTop:10,color:"#a0a0a0",fontSize:11}}>{timeStr}</Text>);

                   }
               }
               this._keySeed++;
               if(records[i].senderUid){
                   var otherPicSource = AppUtil.getAvatarSource(this.isGroupChat?Store.getMember(this.otherSide.id,records[i].senderUid).pic:this.otherSide.pic);
                   recordEls.push(  <View key={this._keySeed} style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"flex-start",width:"100%",marginTop:10}}>
                       {/*<Text>  {this.isGroupChat?Store.getMember(this.otherSide.id,records[i].id).name:this.otherSide.name}  </Text>*/}
                       <Image source={otherPicSource} style={{width:40,height:40,marginLeft:5,marginRight:8}} resizeMode="contain"></Image>
                       <Image source={require('../images/chat-y-l.png')} style={{width:11,height:18,marginTop:11}} resizeMode="contain"></Image>
                       <View style={{maxWidth:200,borderWidth:0,borderColor:"#e0e0e0",backgroundColor:"#f9e160",borderRadius:5,marginLeft:-2,minHeight:40,padding:10,overflow:"hidden"}}>
                           {this._getMessage(records[i])}
                       </View>
                   </View>);
               }else{
                   var iconName = this.getIconNameByState(records[i].state);
                   var msgId = records[i].msgId;
                   recordEls.push(<View key={this._keySeed} style={{flexDirection:"row",justifyContent:"flex-end",alignItems:"flex-start",width:"100%",marginTop:10}}>
                       <TouchableOpacity ChatView={this} msgId={msgId} onPress={this.doTouchMsgState}>
                            <Ionicons name={iconName} size={20}  style={{marginRight:5,lineHeight:40}}/>
                       </TouchableOpacity>
                       <View style={{maxWidth:200,borderWidth:0,borderColor:"#e0e0e0",backgroundColor:"#ffffff",borderRadius:5,minHeight:40,padding:10,overflow:"hidden"}}>
                           {this._getMessage(records[i])}
                       </View>
                       {/*<Text>  {name}  </Text>*/}
                       <Image source={require('../images/chat-w-r.png')} style={{width:11,height:18,marginTop:11}} resizeMode="contain"></Image>
                       <Image source={picSource} style={{width:40,height:40,marginRight:5,marginLeft:8}} resizeMode="contain"></Image>
                   </View>);
               }
           }
       }
       // var img=null;
       // if(this.state.avatarSource){
       //     img = <TouchableOpacity ></TouchableOpacity>;
       // }


        return (
            <View style={{flex:1,backgroundColor:"#f0f0f0"}}>
                <View style={{flex:1,flexDirection:"column",justifyContent:"flex-end",alignItems:"center",bottom:(Platform.OS=="ios"?this.state.heightAnim:0)}}>
                    <ScrollView ref="scrollView" style={{width:"100%",flex:1}}>
                        <View style={{width:"100%",flexDirection:"column",justifyContent:"flex-start",alignItems:"center",marginBottom:20}}>
                            {recordEls}
                        </View>

                    </ScrollView>

                    <View style={{width:"100%",height:44,flexDirection:"row",justifyContent:"center",alignItems:"center",borderTopWidth:1,borderColor:"#d0d0d0",overflow:"hidden"}}>
                        <TextInput ref="text" style={{flex:1,color:"gray",borderWidth:1,borderColor:"#d0d0d0",borderRadius:5,marginRight:5,height:35,backgroundColor:"#f0f0f0",marginLeft:5}} underlineColorAndroid='transparent' defaultValue={""} onSubmitEditing={this.send} onChangeText={this.textChange} returnKeyType="send"/>
                        <TouchableOpacity onPress={this.showImagePicker}>
                            <Ionicons name="ios-camera-outline" size={38}  style={{marginRight:5,}}/>
                        </TouchableOpacity>
                    </View>
                </View>

                <Modal
                    animationType={"fade"}
                    transparent={false}
                    visible={this.state.biggerImageVisible}
                    onRequestClose={() => {}}
                >
                    <View style={{flex:1,backgroundColor:"#000",flexDirection:"row",alignItems:"center"}}>
                    <TouchableOpacity style={{flex:1}} onPress={()=>{this.setState({biggerImageVisible:false,biggerImageUri:null})}}>
                        <Image source={{uri:this.state.biggerImageUri}} style={{flex:1}} resizeMode="contain"></Image>
                    </TouchableOpacity>
                    </View>
                </Modal>
            </View>
        );
    }

}
