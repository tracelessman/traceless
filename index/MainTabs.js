/**
 * Created by renbaogang on 2017/10/31.
 */
import React, { Component} from 'react';
import { Button,Image,TouchableOpacity} from 'react-native';
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

const MainTabs = TabNavigator({
        RecentTab: {
            screen: RecentView,
            navigationOptions: {
                tabBarLabel: '最近',
                title:'最近',

                tabBarIcon: ({ tintColor, focused }) => (
                    focused?<Image source={require('../images/recent.png')} style={{width:20,height:20}} resizeMode="contain"></Image>:
                    <Image source={require('../images/recent_n.png')} style={{width:20,height:20}} resizeMode="contain"></Image>

                )
            }
        },
        ContactTab: {
            screen: ContactView ,
            navigationOptions: {
                tabBarLabel: '通讯录',
                title:'通讯录',

                tabBarIcon: ({ tintColor, focused }) => (
                    focused?<Image source={require('../images/contact.png')} style={{width:20,height:20}} resizeMode="contain"></Image>:
                        <Image source={require('../images/contact_n.png')} style={{width:20,height:20}} resizeMode="contain"></Image>
                )
            }
        },
        AccountTab: {
            screen: MineView ,
            navigationOptions: {
                tabBarLabel: '我的',
                title:'我的',
                tabBarIcon: ({ tintColor, focused }) => (
                    focused?<Image source={require('../images/mine.png')} style={{width:20,height:20}} resizeMode="contain"></Image>:
                        <Image source={require('../images/mine_n.png')} style={{width:20,height:20}} resizeMode="contain"></Image>
                )
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
                activeTintColor:'#000',
                inactiveTintColor: '#d0d0d0',
                showIcon: true,
                style: {
                    backgroundColor:'#f0f0f0',
                    height:50
                },
                labelStyle: {
                    fontSize: 12,
                },
                indicatorStyle: {
                    height:0,
                }
            }
    }
);
var MainStack = StackNavigator({
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
    },ScanView:{
        screen:ScanView,
        navigationOptions:{
            headerTitle: ''
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
