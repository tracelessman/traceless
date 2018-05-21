
import React, { Component } from 'react';
import {
    Alert,
    Text,
    View,
    TextInput,TouchableOpacity,Image,
    Platform
} from 'react-native';
import  WSChannel from '../channel/LocalWSChannel'
import Store from "../store/LocalStore"
import {
    Container, Header, Content, Item, Input, Icon ,Button,Card,CardItem,Body,ListItem,
    List,Thumbnail,Left,Right,Toast,Spinner
} from 'native-base';
import ScanView from '../mine/ScanView'
import AddMemberIcon from './AddMemberIcon'
import AppUtil from "../AppUtil";
const {getAvatarSource} = AppUtil


export default class AddGroupMemberView extends Component<{}> {

    constructor(props){
        super(props);
        this.state={searchResult:null,numberOfLines:2,isScanMode:false,isWaiting:false};
        this.group = this.props.navigation.state.params.group;
        this.alreadyMemberIdAry = this.group.members.map(ele=>{
          return ele.uid
        })
    }

    doSearch=()=>{
        if(this.searchText){
            this.setState({isWaiting:true})
            WSChannel.searchFriends(this.searchText,(data)=>{
                const friendAry = Store.getAllFriends()
                const friendIdAry = friendAry.map(ele=>{
                    return ele.id
                })
                const searchResult = data.result.filter((item)=>{
                   return  item.uid !== Store.getCurrentUid() && friendIdAry.includes(item.uid)
                    && !this.alreadyMemberIdAry.includes(item.uid)
                })

                this.setState({searchResult,isWaiting:false})
            });
        }else{
            Toast.show({
                text: '请输入需要搜索的字符',
                position: "bottom",
            })
        }
    }

    textChange=(v)=>{
        this.searchText = v;
    }
    toggelLine=()=>{
        this.setState({numberOfLines:2})
    }


    render() {

        var searchResult = [];
        if(this.state.searchResult && !this.state.isWaiting){
            if(this.state.searchResult.length > 0){
                searchResult = (
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
                                    <AddMemberIcon uid={data.uid}></AddMemberIcon>
                                </Right>
                            </ListItem>}
                    />
                )

            }else {
                searchResult = (
                    <ListItem thumbnail style={{height:80}}>
                        <Left>
                        </Left>
                        <Body>
                        <Text>
                            没有结果
                        </Text>
                        </Body>
                    </ListItem>
                )
            }
        }


        const searchBarBgColor = Platform.OS === 'android' ?'#bdc6cf' :'#f0f0f0'
        const view2 = (
            <Container>
                <Header searchBar rounded style={{backgroundColor:searchBarBgColor}}>
                    <Item>
                        <Icon name="ios-search"  onPress={this.doSearch} />
                        <Input placeholder="请输入对方昵称或标识" onSubmitEditing={this.doSearch} onChangeText={this.textChange} />

                    </Item>

                </Header>
                <Content style={{marginTop:10}}>
                    {this.state.isWaiting?<Spinner />:null}
                     {searchResult}
                </Content>
            </Container>

           )
        return view2
    }

}
