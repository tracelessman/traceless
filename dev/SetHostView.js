import React, {Component} from 'react';
import {
    Alert,
    AsyncStorage,
    NativeModules,
    Platform,
    StyleSheet,
    View, Modal
} from 'react-native';
import {Form, Item,Label,Input,Picker,Icon,Button,Text} from 'native-base'
import PropTypes from 'prop-types'
import Store from "../store/LocalStore";
import RNFetchBlob from "react-native-fetch-blob";
const config = require('../config')
const {debounceFunc} = require('../util/commonUtil')

export default class SetHostView extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount = () => {

    }

    componentWillUnmount = () => {
    }


    componentWillUnmount = () => {

    }

    onChangeText = (t)=>{
        this.input = t

    }

    onValueChange = (value)=>{
        this.resetUpdateUrl(value)

    }

    resetUpdateUrl = (host)=>{
        config.checkUpdateUrl = `http://${host}:3000/checkUpdateGeneral`
        this.setState({
            update:true
        })
    }

    render() {
        let ary = []
        for(let key in config.hostObj){
            let value = config.hostObj[key]

            ary.push(<Picker.Item label={value} value={value} key={value} />)
        }
        return (
            <View style={{display:'flex',justifyContent:"center",alignItems:"center",marginVertical:15}}>
                <View>
                    <Label >当前更新服务器IP:</Label>

                </View>
                <View>
                    <Label >{config.checkUpdateUrl}</Label>

                </View>

                <View style={{display:'flex',justifyContent:"center",alignItems:"center",marginVertical:15}}>
                    <Item floatingLabel last >
                        <Label>手动设置</Label>
                        <Input ref="input" onChangeText={this.onChangeText}/>
                    </Item>
                </View>
                <View style={{marginVertical:15}}>
                    <Button iconLeft style={{width:100}}  info onPress={debounceFunc(()=>{
                        if(this.input){
                            //TODO ip 校验
                            this.resetUpdateUrl(this.input.trim())
                        }else{
                            Alert.alert('请输入合法的IP地址')
                        }
                    })}>
                        <Icon name='md-settings' />
                        <Text>设置</Text>
                    </Button>
                </View>
                <Form style={{display:'flex',justifyContent:"center",alignItems:"center",marginVertical:15}}>
                    <Item picker last>
                        <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="ios-arrow-down-outline" />}
                            style={{ width: "60%" }}
                            placeholder="选择IP"
                            placeholderStyle={{ color: "#bfc6ea" }}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.selected2}
                            onValueChange={this.onValueChange}
                        >
                            {ary}
                        </Picker>
                    </Item>
                </Form>


            </View>
        );
    }

}

SetHostView.defaultProps = {};

SetHostView.propTypes = {};
