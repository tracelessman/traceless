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
        this.state={biggerImageVisible:false,marignBAnim: new Animated.Value(0),marignTAnim:0};
        this.isGroupChat = this.props.navigation.state.params.group?true:false;

        this.otherSide = this.props.navigation.state.params.friend||this.props.navigation.state.params.group;
        this.text="";
        if(this.isGroupChat){
            this.records = Store.readGroupChatRecords(this.otherSide.id);
        }else{
            this.records = Store.readAllChatRecords(this.otherSide.id);
        }
    }

    _keyboardDidShow=(e)=>{
        let keyY = e.endCoordinates.screenY;
        this.setState({marginTAnim:keyY-Dimensions.get('window').height});

        Animated.timing(
            this.state.marignBAnim,
            {
                toValue: Dimensions.get('window').height-keyY,
                duration: 300
            }
        ).start();
    }
    _keyboardDidHide=(e)=>{
        this.setState({marginTAnim:0});
        Animated.timing(
            this.state.marignBAnim,
            {
                toValue: 0,
                duration: 300
            }
        ).start();
    }

    onReceiveMessage=(fromId)=>{
        if(fromId==this.otherSide.id){
            if(this.isGroupChat){
                this.records = Store.readGroupChatRecords(this.otherSide.id);
            }else{
                this.records = Store.readAllChatRecords(this.otherSide.id);
            }
            this.setState({messageChange:true});
        }

    }

    onSendMessage=(targetId)=>{
        if(targetId==this.otherSide.id)
        this.setState({messageChange:true});
    }

    componentWillMount =()=> {
        Store.on("receiveMessage",this.onReceiveMessage);
        Store.on("sendMessage",this.onSendMessage);
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
        Store.un("receiveGroupMessage",this.onReceiveMessage);
        Store.un("sendGroupMessage",this.onSendMessage);

        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }


    textChange=(v)=>{
        this.text = v;
    }

    componentDidMount=()=>{
        this.refs["scrollView"].scrollToEnd();
    }

    componentDidUpdate=()=>{
        this.refs["scrollView"].scrollToEnd();
    }

    send=()=>{
        if(this.text){
            if(this.isGroupChat){
                WSChannel.sendGroupMessage(this.otherSide.id,this.text,()=>{
                    Store.sendGroupMessage(this.otherSide.id,this.text);
                    this.text="";
                    this.refs["text"].clear();
                    this.refs["scrollView"].scrollToEnd();
                });
            }else{
                WSChannel.sendMessage(this.otherSide.id,this.text,()=>{
                    Store.sendMessage(this.otherSide.id,this.text);
                    this.text="";
                    this.refs["text"].clear();
                    this.refs["scrollView"].scrollToEnd();
                });
            }
        }


    }

    sendImage=(uri,data)=>{
        if(this.isGroupChat){
            WSChannel.sendGroupImage(this.otherSide.id,uri,data,()=>{
                Store.sendGroupImage(this.otherSide.id,uri,data,);
                this.refs["scrollView"].scrollToEnd();
            });
        }else{
            WSChannel.sendImage(this.otherSide.id,uri,data,()=>{
                Store.sendImage(this.otherSide.id,uri,data,);
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
                 // if(response.fileSize>1*1024*1024){


                    ImageResizer.createResizedImage(imageUri, 600, 600, "JPEG", 30, 0, null).then((res) => {
                        RNFetchBlob.fs.readFile(res.path,'base64').then((data)=>{
                            // let source = { uri: 'data:image/jpeg;base64,' + data ,width:400,height:400};
                            // console.info("send img:"+'data:image/jpeg;base64,' + data);
                            this.sendImage(imageUri,'data:image/jpeg;base64,' + data);
                            // this.setState({
                            //     avatarSource: source
                            // });
                        });
                    }).catch((err) => {
                    });
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


    render() {
       var records = this.records;
       var recordEls = [];
       if(records){
           var name = Store.getCurrentName();
           for(var i=0;i<records.length;i++){
               var imgUri = records[i].img;

               if(records[i].id){
                   recordEls.push(  <View key={i} style={{flexDirection:"row",justifyContent:"flex-start",alignItems:"flex-start",width:"100%",marginTop:10}}>
                       <Text>  {this.isGroupChat?Store.getMember(this.otherSide.id,records[i].id).name:this.otherSide.name}  </Text>
                       <View style={{width:200,borderWidth:1,backgroundColor:"#ffffff",borderRadius:2}}>
                       {records[i].text?<Text>{records[i].text}</Text>:<TouchableOpacity chatView={this} imgUri={imgUri} onPress={this.showBiggerImage}><Image source={{uri:imgUri}} style={{width:200,height:200}} resizeMode="contain"/></TouchableOpacity>}
                       </View>
                   </View>);
               }else{
                   recordEls.push(<View key={i} style={{flexDirection:"row",justifyContent:"flex-end",alignItems:"flex-start",width:"100%",marginTop:10}}>
                       <View style={{width:200,borderWidth:1,backgroundColor:"#ffffff",borderRadius:2}}>
                           {records[i].text?<Text>{records[i].text}</Text>:<TouchableOpacity chatView={this} imgUri={imgUri} onPress={this.showBiggerImage}><Image source={{uri:imgUri}} style={{width:200,height:200}} resizeMode="contain"/></TouchableOpacity>}
                       </View><Text>  {name}  </Text>
                   </View>);
               }
           }
       }
       // var img=null;
       // if(this.state.avatarSource){
       //     img = <TouchableOpacity ></TouchableOpacity>;
       // }


        return (
            <View style={{flex:1,flexDirection:"column",justifyContent:"flex-end",alignItems:"center",backgroundColor:"#f0f0f0"}}>
                    <ScrollView ref="scrollView" style={{width:"100%",marginTop:this.state.marginTAnim}}>
                        <View style={{width:"100%",flexDirection:"column",justifyContent:"flex-start",alignItems:"center"}}>
                            {recordEls}
                            <View style={{height:100}}/>
                        </View>
                    </ScrollView>
                <Animated.View style={{marginBottom:this.state.marignBAnim,width:"100%",height:44,flexDirection:"row",justifyContent:"center",alignItems:"center",borderTopWidth:1,borderColor:"#d0d0d0"}}>
                    <TextInput ref="text" style={{flex:1,color:"gray",borderWidth:1,borderColor:"#d0d0d0",borderRadius:5,marginRight:5,height:35,backgroundColor:"#ffffff",marginLeft:5}} underlineColorAndroid='transparent' defaultValue={""} onSubmitEditing={this.send} onChangeText={this.textChange} returnKeyType="send"/>
                    <TouchableOpacity onPress={this.showImagePicker}>
                        <Image source={require('../images/photo.png')} style={{width:40,height:35,marginRight:5}} resizeMode="contain"></Image>
                    </TouchableOpacity>
                </Animated.View>

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
