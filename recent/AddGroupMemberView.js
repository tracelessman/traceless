
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
import AddMemberIcon from './AddMemberIcon'
import AppUtil from "../AppUtil";
const {getAvatarSource} = AppUtil
const _ = require('lodash')


export default class AddGroupMemberView extends Component<{}> {

    constructor(props){
        super(props);

        this.group = this.props.navigation.state.params.group;
        this.alreadyMemberIdAry = this.group.members.map(ele=>ele.uid)
        const friendAry = _.cloneDeep(Store.getAllFriends())
        const friendListAry = friendAry.filter((item)=>!this.alreadyMemberIdAry.includes(item.id)).map(item =>{
            item.uid = item.id
            return item
        })

        this.state={
            friendListAry,
            isWaiting:false,
            hasNoResult:false,
            allAdded:friendListAry.length === 0
        };

    }

    doSearch=()=>{
        const searchText = this.refs.input.wrappedInstance._lastNativeText
        if(searchText && searchText.trim()){
            this.setState({isWaiting:true})
            const friendAry = _.cloneDeep(Store.getAllFriends())
            const searchResult = friendAry.filter((item)=> {
                let result = item.name.includes(searchText) || item.id.includes(searchText)
                result = result && !this.alreadyMemberIdAry.includes(item.id)
                return result
            }).map(item =>{
                item.uid = item.id
                return item
            })

            this.setState({friendListAry:searchResult,isWaiting:false,hasNoResult:searchResult.length===0})
        }else{
            Toast.show({
                text: '请输入需要搜索的字符',
                position: "bottom",
            })
        }
    }

    componentDidMount(){
    }

    showAll = ()=>{
        const friendAry = _.cloneDeep(Store.getAllFriends())

        const searchResult = friendAry.filter((item)=>!this.alreadyMemberIdAry.includes(item.id)).map(item =>{
            item.uid = item.id
            return item
        }).map(item =>{
            item.uid = item.id
            return item
        })

        this.setState({friendListAry:searchResult,isWaiting:false,hasNoResult:false})
    }

    render() {
        let friendListAryRendered =
                    <List
                        dataArray={this.state.friendListAry}
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
                                <AddMemberIcon checked={()=>{
                                    WSChannel.addGroupMembers(this.group.id,[data])
                                    Toast.show({
                                        text: `成功添加群成员${data.name}`,
                                        position: "bottom",
                                        type:"success",
                                        duration: 3000
                                    })
                                }}></AddMemberIcon>
                            </ListItem>}
                    />


        let noResult =
            <ListItem thumbnail style={{height:80}}>
                <Left>
                </Left>
                <Body>
                <Text>
                    没有搜索结果
                </Text>
                </Body>
            </ListItem>
        let allAdded =
            <ListItem thumbnail style={{height:80}}>
                <Left>
                </Left>
                <Body>
                <Text>
                    所有的好友都已经加入该群!
                </Text>
                </Body>
            </ListItem>

        const searchBarBgColor = Platform.OS === 'android' ?'#bdc6cf' :'#f0f0f0'

        const view2 =
            <Container>
                <Header searchBar rounded style={{backgroundColor:searchBarBgColor}}>
                    <Item>
                        <Icon name="ios-search"  onPress={this.doSearch} />
                        <Input  ref="input" placeholder="请输入对方昵称或标识" onSubmitEditing={this.doSearch} />
                        <Icon name="ios-close-circle-outline" onPress={()=>{
                            this.refs.input.wrappedInstance.clear()
                            this.showAll()
                        }} />
                    </Item>
                </Header>
                <Content style={{marginTop:10}}>
                    {this.state.isWaiting? <Spinner />:(this.state.allAdded?allAdded:
                        (this.state.friendListAry.length===0?noResult:friendListAryRendered)
                    )}
                </Content>
            </Container>


        return view2
    }

}
