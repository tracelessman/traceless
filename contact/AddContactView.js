
import React, { Component } from 'react';
import {
    Alert,
    Image,
    Platform,
    Text,TextInput,TouchableOpacity,
    View
} from 'react-native';
import  WSChannel from '../channel/LocalWSChannel'
import Store from "../store/LocalStore"
import {
    Body, Button, Card, CardItem, Container, Content ,Header,Icon,Input,Item,Left,
    List,ListItem,Right,Spinner,Thumbnail,Toast
} from 'native-base';
import ScanView from '../mine/ScanView'
import AddFriendIcon from './AddFriendIcon'
import AppUtil from "../AppUtil";
const {getAvatarSource} = AppUtil


export default class AddContactView extends Component<{}> {

    constructor(props){
        super(props);
        this.state={searchResult:null,numberOfLines:2,isScanMode:false,isWaiting:false};
    }

    doSearch=()=>{
        if(this.searchText){
            this.setState({isWaiting:true})
            WSChannel.searchFriends(this.searchText,(data)=>{
                const friendAry = Store.getAllFriends()
                const friendIdAry = friendAry.map(ele=>ele.id)
                const searchResult = data.result.filter((item)=>item.uid !== Store.getCurrentUid() && !friendIdAry.includes(item.uid))

                this.setState({searchResult,isWaiting:false})
            });
        }else{
            Toast.show({
                text: '请输入需要搜索的字符',
                position: "bottom",
            })
        }
    }

    addFriend = (fid)=>new Promise(resolve => {
            WSChannel.applyMakeFriends(fid, (result)=> {
                resolve()
                Toast.show({
                    text: '好友申请已发送，等待对方审核',
                    position: "top",
                    type:"success",
                    duration: 1500
                })
            })
        })

    textChange=(v)=>{
        this.searchText = v;
    }
    toggelLine=()=>{
        this.setState({numberOfLines:2})
    }


    afterScan=(data)=>{
        let errorMsg
        const notValidMsg = '二维码数据无效,请核对后重试'
        if(data){
            const {uid,ip,code,action} = data
            if(uid && ip){
                if(ip === Store.getCurrentServer()){
                    if(uid === Store.getCurrentUid()){
                        errorMsg = '该二维码标识是当前用户标识,不能向自己发送好友请求'
                    }
                }else{
                    errorMsg = '服务器地址与当前应用的服务器地址不符,请核对后重试'
                }
            }else{
                errorMsg = notValidMsg
            }
        }else{
            errorMsg = notValidMsg
        }
        if(errorMsg){
            Toast.show({
                text: errorMsg,
                position: "top",
                type:"warning",
                duration: 4000
            })
            this.setState({isScanMode:false});
        }else{
            this.addFriend(data.uid)
            this.setState({isScanMode:false});
        }


    }

    hideScanView=()=>{
        this.setState({isScanMode:false});
    }

    render() {

        let searchResult = [];
        if(this.state.searchResult && !this.state.isWaiting){
            if(this.state.searchResult.length > 0){
                searchResult = 
                    <List
                        dataArray={this.state.searchResult}
                        renderRow={data =>
                            <ListItem thumbnail>
                                <Left>
                                    <Thumbnail square size={35} source={getAvatarSource(data.pic)} />
                                </Left>
                                <Body>
                                <Text>
                                    {data.name}
                                </Text>
                                </Body>
                                <Right>
                                    <AddFriendIcon uid={data.uid}></AddFriendIcon>
                                </Right>
                            </ListItem>}
                    />
                

            }else {
                searchResult = 
                    <ListItem thumbnail style={{height:80}}>
                        <Left>
                        </Left>
                        <Body>
                        <Text>
                            没有结果,试试扫码添加吧
                        </Text>
                        </Body>
                        <Right>
                            <Button bordered onPress={()=>{
                                this.setState({isScanMode:true})
                            }}>
                                <Icon active name='md-camera' />
                            </Button>
                        </Right>
                    </ListItem>
                
            }
        }

        const view1 = <ScanView action="addFriend" parent={this}></ScanView>
        const searchBarBgColor = Platform.OS === 'android' ?'#bdc6cf' :'#f0f0f0'
        const view2 = 
            <Container>
                <Header searchBar rounded style={{backgroundColor:searchBarBgColor}}>
                    <Item>
                        <Icon name="ios-search"  onPress={this.doSearch} />
                        <Input placeholder="请输入对方昵称或标识" onSubmitEditing={this.doSearch} onChangeText={this.textChange} />
                        <Icon name="ios-qr-scanner" onPress={()=>{
                            this.setState({isScanMode:true})
                        }} />
                    </Item>

                </Header>
                <Content style={{marginTop:10}}>
                    {this.state.isWaiting?<Spinner />:null}
                     {searchResult}
                </Content>
            </Container>

           
        return this.state.isScanMode?view1:view2
    }

}
