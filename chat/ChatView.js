
import React, { Component } from 'react';
import {
    Animated,
    Button,
    Dimensions,
    Image,
    Keyboard,
    Modal,
    Platform,ScrollView,Text,TextInput,TouchableOpacity,View,WebView,
    Alert,RefreshControl,
    CameraRoll
} from 'react-native';

import Store from "../store/LocalStore";
import WSChannel from "../channel/LocalWSChannel";
import ImagePicker from 'react-native-image-picker';
import ImageResizer from 'react-native-image-resizer';
import RNFetchBlob from 'react-native-fetch-blob';
import Ionicons from 'react-native-vector-icons/Ionicons'
import AppUtil from "../AppUtil"
const {getAvatarSource,debounceFunc} = AppUtil
import ImageZoom from 'react-native-image-pan-zoom';
import ImageViewer from 'react-native-image-zoom-viewer';
import {
    Toast
}from 'native-base'
const config = require('../config')
import MessageText from './MessageText'
const {MAX_INPUT_HEIGHT} = require('../state/Constant')
const {getFolderId} = require('../util/commonUtil')
const Constant = require('../state/Constant')
import {Header} from 'react-navigation'
import ActivityIndicator from './ActivityIndicator'

export default class ChatView extends Component<{}> {
    static navigationOptions =({ navigation, screenProps }) => (

        {
            headerTitle: navigation.state.params.friend?navigation.state.params.friend.name:navigation.state.params.group.name,
            headerRight:(navigation.state.params.group?
                <TouchableOpacity  onPress={debounceFunc(()=>{navigation.navigate("GroupInfoView",{group:navigation.state.params.group})})}
                                   style={{marginRight:20}}>
                    <Image source={require('../images/group.png')} style={{width:22,height:22}} resizeMode="contain"></Image>
                </TouchableOpacity>
                :null),
        }
    );


    constructor(props){
        super(props);
        this.minHeight = 35
        this.originalContentHeight = Dimensions.get("window").height - Header.HEIGHT
        this.isGroupChat = this.props.navigation.state.params.group?true:false;
        this.state={
            biggerImageVisible:false,
            heightAnim: 0,
            height:this.minHeight,
            refreshing:false,
            msgViewHeight:this.originalContentHeight,
            isInited:false
        };

        this.otherSide = this.props.navigation.state.params.friend||this.props.navigation.state.params.group;
        if(this.isGroupChat){
            this.groupMemberInfo = this.getGroupMemberInfo(this.props.navigation.state.params.group)

        }
        this.text="";
        this._keySeed = 0;
        this.folderId  = getFolderId(RNFetchBlob.fs.dirs.DocumentDir)
        this.limit = Constant.MESSAGE_PER_REFRESH
        this.extra = {
            lastContentHeight:0,
            contentHeight:0,
            count:0,
            isRefreshingControl:false
        }
    }

    getGroupMemberInfo(group){
        let result = {}
        if(group){
            for(let member of group.members){
                result[member.uid] = member
            }
        }
        return result
    }

    refreshRecord = (limit)=>{

        this.getAllRecord(limit).then(recordAry=>{
            let records = _.cloneDeep(recordAry)

            const imageUrls = []
            const imageIndexer = {}
            let index = 0
            for(let i=0;i < records.length;i++){
                const record = records[i]
                if(record.type==Store.MESSAGE_TYPE_IMAGE){
                    let img = JSON.parse(record.content);

                    img.data = this.getImageData(img)

                    imageUrls.push({
                        url: "file://"+img.data,
                        props: {
                        }
                    })
                    imageIndexer[record.msgId] = index
                    index++
                }
            }
            this.imageIndexer = imageIndexer


            let recordEls = [];
            if(records){
                let lastSpTime;
                let picSource = AppUtil.getAvatarSource(Store.getPersonalPic());
                let now = new Date();
                for(let i=0;i<records.length;i++){
                    if(lastSpTime&&records[i].time-lastSpTime>10*60*1000||!lastSpTime){
                        lastSpTime = records[i].time;
                        if(lastSpTime){
                            let timeStr="";
                            let date = new Date();
                            date.setTime(lastSpTime);
                            if(now.getFullYear()==date.getFullYear()&&now.getMonth()==date.getMonth()&&now.getDate()==date.getDate()){
                                timeStr+="今天 ";
                            }else if(now.getFullYear()==date.getFullYear()){
                                timeStr+=date.getMonth()+1+"月"+date.getDate()+"日 ";
                            }
                            timeStr+=date.getHours()+":"+(date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes());
                            recordEls.push(<Text  style={{marginVertical:10,color:"#a0a0a0",fontSize:11}} key={timeStr}>{timeStr}</Text>);

                        }
                    }
                    this._keySeed++;
                    const  style = {
                        recordEleStyle:{flexDirection:"row",justifyContent:"flex-start",alignItems:(records[i].type==Store.MESSAGE_TYPE_IMAGE?"flex-start":"flex-start"),width:"100%",marginTop:15}
                    }

                    if(records[i].senderUid){
                        let oldLzUid = "9711afa5-a07b-4a37-bbd4-5b3eaca81984"
                        if(records[i].senderUid === oldLzUid ){
                            continue
                        }
                        if(this.isGroupChat && !this.groupMemberInfo[records[i].senderUid]){
                            if(Store.getCurrentUid() === config.spiritUid){
                                // Alert.alert("error",`${records[i].senderUid}`)
                            }
                            // console.log(records[i].senderUid)
                            // console.log(this.groupMemberInfo)
                            continue
                        }
                        let otherPicSource = AppUtil.getAvatarSource(this.isGroupChat?Store.getMember(this.otherSide.id,records[i].senderUid)?Store.getMember(this.otherSide.id,records[i].senderUid).pic:null:this.otherSide.pic);

                        recordEls.push(  <View key={records[i].msgId} style={style.recordEleStyle}>
                            <Image source={otherPicSource} style={{width:40,height:40,marginLeft:5,marginRight:8}} resizeMode="contain"></Image>
                            <View style={{flexDirection:"column",justifyContent:"center",alignItems:"flex-start",}}>
                                {this.isGroupChat?
                                    <View style={{marginBottom:8,marginLeft:5}}>
                                        <Text style={{color:"#808080",fontSize:13}}> {this.groupMemberInfo[records[i].senderUid].name}</Text>
                                    </View>
                                    :null}


                                <View style={{flexDirection:"row",justifyContent:"center",alignItems:"flex-start",}}>
                                    <Image source={require('../images/chat-y-l.png')} style={{width:11,height:18,marginTop:11}} resizeMode="contain"></Image>
                                    <View style={{maxWidth:200,borderWidth:0,borderColor:"#e0e0e0",backgroundColor:"#f9e160",borderRadius:5,marginLeft:-2,minHeight:40,padding:10,overflow:"hidden"}}>
                                        {this._getMessage(records[i])}
                                    </View>
                                </View>
                            </View>
                        </View>);
                    }else{
                        let iconName = this.getIconNameByState(records[i].state);
                        let msgId = records[i].msgId;
                        recordEls.push(<View key={msgId} style={{flexDirection:"row",justifyContent:"flex-end",alignItems:"flex-start",width:"100%",marginTop:10}}>
                            <TouchableOpacity ChatView={this} msgId={msgId} onPress={this.doTouchMsgState}>
                                <Ionicons name={iconName} size={20}  style={{marginRight:5,lineHeight:40,color:(records[i].state === Store.MESSAGE_STATE_SERVER_NOT_RECEIVE?"red":"black")}}/>
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
            this.setState({
                recordEls,
                refreshing:false,
                imageUrls,
                isInited:true
            })
        })
    }

    getAllRecord = (limit)=>{
        return new Promise(resolve=>{
            if(this.isGroupChat){
                Store.readGroupChatRecords(this.otherSide.id,false,(recordAry)=>{
                    resolve(recordAry)
                },limit);
                Store.readGroupChatRecords(this.otherSide.id,false,(recordAry)=>{
                    this.extra.maxCount = recordAry.length
                });
            }else{
                Store.readAllChatRecords(this.otherSide.id,false,(recordAry)=>{
                    resolve(recordAry)
                },limit);
                Store.readAllChatRecords(this.otherSide.id,false,(recordAry)=>{
                    this.extra.maxCount = recordAry.length
                });
            }
        })

    }



    _keyboardDidShow=(e)=>{
        const {height} = Dimensions.get('window')
        let keyY = e.endCoordinates.screenY;
        const headerHeight = Header.HEIGHT
        let change = {}

        if(this.extra.contentHeight + headerHeight < keyY){
            change.msgViewHeight = keyY - headerHeight
        }else{
            change.heightAnim = height-keyY
        }

        this.setState(change)
    }
    _keyboardDidHide=(e)=>{
        this.setState({heightAnim:0,msgViewHeight:this.originalContentHeight})
    }

    onReceiveMessage=(fromId)=>{
        if(fromId==this.otherSide.id){

            this.limit++
            this.refreshRecord(this.limit);
        }

    }

    onSendMessage=(targetId)=>{
        if(targetId==this.otherSide.id){

            this.limit++
            this.refreshRecord(this.limit);
        }
    }

    update = ()=>{
        this.refreshRecord(this.limit);
    }
    componentWillMount =()=> {
        Store.on("receiveMessage",this.onReceiveMessage);
        Store.on("sendMessage",this.onSendMessage);
        Store.on("updateMessageState",this.update);
        Store.on("updateGroupMessageState",this.update);
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
        Store.un("updateMessageState",this.update);
        Store.un("updateGroupMessageState",this.update);
        Store.un("receiveGroupMessage",this.onReceiveMessage);
        Store.un("sendGroupMessage",this.onSendMessage);

        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }


    textChange=(v)=>{
        this.text = v;

    }


    componentDidMount=()=>{
        this.refreshRecord(this.limit);
    }

    componentDidUpdate=()=>{

    }


    send=()=>{
      setTimeout(() => {
        this.refs.text.clear();
      }, 0)
      const callback = ()=>{
            this.text="";
        };
        if(this.text){
            if(this.isGroupChat){
                WSChannel.sendGroupMessage(this.otherSide.id,this.otherSide.name,this.text,callback);
            }else{
                WSChannel.sendMessage(this.otherSide.id,this.text,callback);
            }
        }


    }

    sendImage=(data)=>{
        const callback = ()=>{
            this.refs.scrollView.scrollToEnd();
        };
        if(this.isGroupChat){
            WSChannel.sendGroupImage(this.otherSide.id,this.otherSide.name,data,callback);
        }else{
            WSChannel.sendImage(this.otherSide.id,data,callback);
        }

    }

    showImagePicker=()=>{
        let options = {
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
                let imageUri = response.uri;

                const maxWidth = 1000
                const maxHeight = 1000
                ImageResizer.createResizedImage(imageUri, maxWidth, maxHeight, "JPEG", 70, 0, null).then((res) => {

                    RNFetchBlob.fs.readFile(res.path,'base64').then((data)=>{
                        this.sendImage({data,width:maxWidth,height:maxHeight});
                    });
                }).catch((err) => {
                    console.log(err)

                });

            }
        });
    }

    showBiggerImage= (imgUri,msgId)=>{
        const biggerImageIndex = this.imageIndexer[msgId]

        this.setState({biggerImageVisible:true,biggerImageUri:imgUri,biggerImageIndex});
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
                    {WSChannel.resendMessage(rec.msgId,this.ChatView.otherSide.id,rec.content);}
                    else if(rec.type==Store.MESSAGE_TYPE_IMAGE)
                    {WSChannel.resendImage(rec.msgId,this.ChatView.otherSide.id,JSON.parse(rec.content))}
                }
            });
        }
    }

    _getMessage=(rec)=>{
        if(rec.type==Store.MESSAGE_TYEP_TEXT){
            const text = (
                <MessageText  currentMessage={
                    {text:rec.content}
                } textStyle={{fontSize:16,lineHeight:19,color:(rec.state==Store.MESSAGE_STATE_SERVER_NOT_RECEIVE?"red":"black")}}
                ></MessageText>
            )

            return text

        }else if(rec.type==Store.MESSAGE_TYPE_IMAGE) {
            let img = JSON.parse(rec.content);

            img.data = this.getImageData(img)

            let imgUri = img;
            let imgW = 180;
            let imgH = 180;
            if(img&&img.data){
                imgUri = "file://"+img.data;

            }
            return <TouchableOpacity  onPress={()=>{this.showBiggerImage(imgUri,rec.msgId)}}><Image source={{uri:imgUri}} style={{width:imgW,height:imgH}} resizeMode="contain"/></TouchableOpacity>;
        }else if(rec.type==Store.MESSAGE_TYPE_FILE){
            let file = JSON.parse(rec.content);
            return <TouchableOpacity><Ionicons name="ios-document-outline" size={40}  style={{marginRight:5,lineHeight:40}}></Ionicons><Text>{file.name}(请在桌面版APP里查看)</Text></TouchableOpacity>;
        }
    }

    getImageData = (img)=> {
        let result = img.data
        if(Platform.OS === 'ios'){
            result = img.data.replace(getFolderId(img.data), this.folderId);
        }
        return result
    }
    _onRefresh = ()=>{
        this.limit = this.limit+Constant.MESSAGE_PER_REFRESH
        if(this.limit > this.extra.maxCount){
            Toast.show({
                text: '没有更早的消息记录',
                position:"top"
            })
        }else{
            this.setState({
                refreshing:true
            })
            this.extra.isRefreshingControl = true
            this.refreshRecord(this.limit)
        }



    }


    onContentSizeChange=(contentWidth,contentHeight)=>{
        this.extra.lastContentHeight = this.extra.contentHeight
        this.extra.contentHeight = contentHeight
        this.extra.count++
        const adjustment = 70
        const offset = Math.floor(this.extra.contentHeight - this.extra.lastContentHeight) - adjustment

        if(this.extra.count === 1 ){
            this.refs.scrollView.scrollToEnd({animated: false})
        }else if(this.extra.count > 1){
            if(this.extra.isRefreshingControl){
                this.refs.scrollView.scrollTo({x: 0, y:offset , animated: false})
                this.extra.isRefreshingControl = false
            }else{
                this.refs.scrollView.scrollToEnd({animated: false})
            }
        }
    }

    render() {
        const initedView =
            <View style={{backgroundColor:"#f0f0f0",height:this.state.msgViewHeight}}>
                <View style={{flex:1,flexDirection:"column",justifyContent:"flex-end",alignItems:"center",bottom:Platform.OS=="ios"?this.state.heightAnim:0}}>
                    <ScrollView ref="scrollView" style={{width:"100%"}}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.refreshing}
                                        onRefresh={this._onRefresh}
                                    />}
                                onContentSizeChange={this.onContentSizeChange}
                    >
                        <View style={{width:"100%",flexDirection:"column",justifyContent:"flex-start",alignItems:"center",marginBottom:20}}>
                            {this.state.recordEls}
                        </View>
                    </ScrollView>
                    <View style={{width:"100%",flexDirection:"row",justifyContent:"center",alignItems:"flex-end",
                        borderTopWidth:1,borderColor:"#d0d0d0",overflow:"hidden",paddingVertical:5,marginBottom:0}}>
                        <TextInput multiline ref="text" style={{flex:1,color:"black",fontSize:16,paddingHorizontal:4,borderWidth:1,
                            borderColor:"#d0d0d0",borderRadius:5,marginHorizontal:5,minHeight: this.minHeight ,backgroundColor:"#f0f0f0",marginBottom:5,height:this.state.height}}
                                   blurOnSubmit={false} returnKeyType="send" enablesReturnKeyAutomatically
                                   underlineColorAndroid='transparent' defaultValue={""} onSubmitEditing={debounceFunc(this.send)}
                                   onChangeText={this.textChange}   onContentSizeChange={(event) => {
                            let height = event.nativeEvent.contentSize.height
                            if(height <  this.minHeight ){
                                height =  this.minHeight
                            }else{
                                height += 10
                            }
                            if(this.state.height !== height){
                                if(height > MAX_INPUT_HEIGHT){
                                    height = MAX_INPUT_HEIGHT
                                }
                                this.setState({height:height})

                            }
                        }}/>

                        <TouchableOpacity onPress={this.showImagePicker}
                                          style={{display:"flex",alignItems:"flex-end",justifyContent:"center"}}>
                            <Ionicons name="ios-camera-outline" size={38}  style={{marginRight:5}}/>
                        </TouchableOpacity>
                    </View>
                </View>

                <Modal visible={this.state.biggerImageVisible} transparent={false}   animationType={"fade"}
                >
                    <ImageViewer imageUrls={this.state.imageUrls}
                                 onClick={()=>{this.setState({biggerImageVisible:false,biggerImageUri:null})}}
                                 onSave={(url)=>{

                                     CameraRoll.saveToCameraRoll(url)
                                     Alert.alert(
                                         '',
                                         '图片成功保存到系统相册',

                                         { cancelable: true }
                                     )
                                 }}
                                 index={this.state.biggerImageIndex}
                    />
                </Modal>
            </View>
        const loadingView = <ActivityIndicator/>
        return  this.state.isInited?initedView:loadingView
    }

}
