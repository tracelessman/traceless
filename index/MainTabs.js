/**
 * Created by renbaogang on 2017/10/31.
 */
import React, { Component} from 'react';
import { Button,Image,TouchableOpacity,View,Text} from 'react-native';
import {TabNavigator } from 'react-navigation';
import {StackNavigator}from "react-navigation";
import RecentView from '../recent/RecentView';
import ContactView from '../contact/ContactView';
import AddContactView from '../contact/AddContactView';
import RequireListView from '../contact/RequireListView';
import FriendInfoView from '../contact/FriendInfoView';
import MineView from '../mine/MineView';
import ChatView from '../recent/ChatView'
import AddGroupView from '../recent/AddGroupView'
import GroupInfoView from '../recent/GroupInfoView'
import ScanView from '../mine/ScanView'
import QrcodeView from '../mine/QrcodeView'
import UidView from '../mine/UidView'
import GroupMsgStateView from '../recent/GroupMsgStateView'
import AddGroupMemberView from '../recent/AddGroupMemberView'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import Tab from './Tab'
const iconSize = 26

let style = {display:"flex",justifyContent:"center",alignItems:"center"}
function getTabLogo(title,focused,iconName){
    let color = focused?"#f9e160":"#d0d0d0"
      return(
          <View style={style}>
              <Icon name={iconName} size={iconSize}  color={color}/>
              <Text style={{fontSize:10, color}}>{title}</Text>
          </View>
      )
}



const MainTabs = TabNavigator({
        RecentTab: {
            screen: RecentView,
            navigationOptions: {
                tabBarLabel: '消息',
                title:'消息',

                tabBarIcon: ({ tintColor, focused }) =>
                {
                    let color = focused?"#f9e160":"#d0d0d0"
                    return (
                        <View style={style}>
                            <Tab type="recent" focused={focused}></Tab>
                            <Text style={{fontSize:10,color}}>消息</Text>
                        </View>
                    )
                }
            }
        },
        ContactTab: {
            screen: ContactView ,
            navigationOptions: {
                tabBarLabel: '通讯录',
                title:'通讯录',

                tabBarIcon: ({ tintColor, focused }) =>{
                    return getTabLogo('通讯录',focused,"table-of-contents" )
                }

            }
        },
        AccountTab: {
            screen: MineView ,
            navigationOptions: {
                tabBarLabel: '我的',
                title:'我的',
                tabBarIcon: ({ tintColor, focused }) =>{
                    return getTabLogo('我的',focused,"account-outline" )
                }

            },

        }
    }, {
        // initialRouteName: routeName ,
        swipeEnabled: false,
        lazy:false,
        animationEnabled:false,
        headerMode:"screen",
        tabBarPosition: 'bottom',
        tabBarOptions:
            {
                activeTintColor:'#f9e160',
                inactiveTintColor: '#d0d0d0',
                showIcon: true,
                style: {
                    backgroundColor:'#434343',
                    height:50
                },
                labelStyle: {
                    fontSize: 12,
                },
                indicatorStyle: {
                    height:0,
                },
                showLabel:false
            }
    }
);
let MainStack = StackNavigator({
    MainTabView: {
        screen: MainTabs,
        navigationOptions:{

        }
    },
    AddContactView:{
        screen:AddContactView,
        navigationOptions:{
            headerTitle: '添加朋友'
        }
    },
    RequireListView:{
        screen:RequireListView,
        navigationOptions:{
            headerTitle: '新朋友'
        }
    },
    FriendInfoView:{
        screen:FriendInfoView,
        navigationOptions:{
            headerTitle: '详细资料'
        }
    },
    ChatView:{
        screen:ChatView

    },
    AddGroupView:{
        screen:AddGroupView,
        navigationOptions:{
            headerTitle: '创建群'
        }
    },
    GroupInfoView:{
        screen:GroupInfoView,
        navigationOptions:{
            headerTitle: '群成员'
        }
    },
    ScanView:{
        screen:ScanView,
        navigationOptions:{
            headerTitle: '扫描二维码'
        }
    },
    QrcodeView:{
        screen:QrcodeView,
        navigationOptions:{
            headerTitle: '个人二维码'
        }
    },
    UidView:{
        screen:UidView,
        navigationOptions:{
            headerTitle: '标识'
        }
    },
    GroupMsgStateView:{
        screen:GroupMsgStateView,
        navigationOptions:{
            headerTitle: '消息状态'
        }
    },
    AddGroupMemberView:{
      screen:AddGroupMemberView,
      navigationOptions:{
          headerTitle: '添加群成员'
      }
    }
}, {
    transitionConfig:function transitionConfig(){
        return {
            screenInterpolator: sceneProps => {
                const { layout, position, scene } = sceneProps;
                const { index } = scene;
                const translateX = position.interpolate({
                    inputRange: [index - 1, index, index + 1],
                    outputRange: [layout.initWidth, 0, 0]
                });
                const opacity = position.interpolate({
                    inputRange: [index - 1, index - 0.99, index, index + 0.99, index + 1],
                    outputRange: [0, 1, 1, 0.3, 0]
                });
                return { opacity, transform: [{ translateX }] }
            }
        };
    }
});

//
export default <MainStack onNavigationStateChange={null}/>;
