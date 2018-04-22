
import React, { Component } from 'react';
import {
    Alert,
    Text,
    View,
    TextInput,TouchableOpacity,Image
} from 'react-native';
import  WSChannel from '../channel/LocalWSChannel'
import Store from "../store/LocalStore"
import {
    Container, Header, Content, Item, Input, Icon ,Button,Card,CardItem,Body,ListItem,List,Thumbnail,Left,Right,Toast
} from 'native-base';
import ScanView from '../mine/ScanView'


export default class AddContactView extends Component<{}> {

    constructor(props){
        super(props);
        this.state={searchResult:null,numberOfLines:2,isScanMode:false};
    }

    doSearch=()=>{
        if(this.searchText){
            WSChannel.searchFriends(this.searchText,(data)=>{
                // var result = [{id:"id1",name:"name1"},{id:"id2",name:"name2"}];
                this.setState({searchResult:data.result});
            });
        }else{
            Toast.show({
                text: '请输入需要搜索的字符',
                position: "bottom",
            })
        }
    }

    addFriend = (fid)=>{
        WSChannel.applyMakeFriends(fid, (result)=> {
            Toast.show({
                text: '好友申请已发送，等待对方审核',
                position: "top",
                type:"success",
                duration: 3000
            })
        })
    }

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
                        errorMsg = '该二维码标识是当前用户标识,不能发送好友请求'
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
        var searchResult = [];
        if(this.state.searchResult){
            if(this.state.searchResult.length > 0){
                searchResult = (
                    <List
                        dataArray={this.state.searchResult}
                        renderRow={data =>
                            <ListItem thumbnail>
                                <Left>
                                    <Thumbnail square size={35} source={data.pic?{uri:data.pic}:require('../images/defaultAvatar.png')} />
                                </Left>
                                <Body>
                                <Text>
                                    {data.name}
                                </Text>
                                <Text numberOfLines={this.state.numberOfLines}  onPress={this.toggelLine}>
                                    {data.uid}
                                </Text>
                                </Body>
                                <Right>
                                    <Button transparent onPress={()=>{
                                        this.addFriend(data.uid)
                                    }}>
                                        <Icon name='ios-send' />
                                    </Button>
                                </Right>
                            </ListItem>}
                    />
                )

            }else{
                searchResult = (
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
                )
            }
        }

        const view1 = (<ScanView action="register" parent={this}></ScanView>)
        const view2 = (
            <Container>
                <Header searchBar rounded style={{backgroundColor:'#2d8cf0'}}>
                    <Item>
                        <Icon name="ios-search"  onPress={this.doSearch} />
                        <Input placeholder="请输入对方昵称或标识" onSubmitEditing={this.doSearch} onChangeText={this.textChange} />
                        <Icon name="ios-qr-scanner" onPress={()=>{
                            this.setState({isScanMode:true})
                        }} />
                    </Item>

                </Header>
                <Content style={{marginTop:10}}>
                     {searchResult}
                </Content>
            </Container>

           )
        return this.state.isScanMode?view1:view2
    }

}
