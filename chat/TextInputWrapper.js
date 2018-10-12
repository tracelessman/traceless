import React, {Component} from 'react';
import {
  Text, TextInput,
  View,
} from 'react-native';
import PropTypes from 'prop-types'
import AppUtil from "../AppUtil"
const {getAvatarSource,debounceFunc} = AppUtil
const Constant = require('../state/Constant')
const {MAX_INPUT_HEIGHT} = Constant
const uuid = require('uuid')

export default class TextInputWrapper extends Component<{}> {
  constructor(props) {
    super(props);
    this.minHeight = 35
    this.state = {
      height: this.minHeight
    };
  }

  componentDidMount() {

  }

  componentDidUpdate() {
  }


  componentWillUnmount() {

  }

  reload(){
    console.log('reload')
    this.setState({key:uuid()})
  }

  render() {
    const {onChangeText, onSubmitEditing} = this.props
    console.log('wrapper render')
    return (
      <TextInput multiline ref="text" style={{flex:1,color:"black",fontSize:16,paddingHorizontal:4,borderWidth:1,
        borderColor:"#d0d0d0",borderRadius:5,marginHorizontal:5,minHeight: this.minHeight ,backgroundColor:"#f0f0f0",marginBottom:5,height: this.state.height}}
                 blurOnSubmit={false} returnKeyType="send" enablesReturnKeyAutomatically
                 underlineColorAndroid='transparent' defaultValue={""} onSubmitEditing={debounceFunc(onSubmitEditing)}
                 onChangeText={onChangeText}   onContentSizeChange={(event) => {
        let heightContent = event.nativeEvent.contentSize.height
        if(heightContent <  this.minHeight ){
          heightContent =  this.minHeight
        }else{
          heightContent += 10
        }
        if(this.state.height !== heightContent){
          if(heightContent > MAX_INPUT_HEIGHT){
            heightContent = MAX_INPUT_HEIGHT
          }
          this.setState({height: heightContent})

        }
      }} key={this.state.key}/>
    )
  }

}

TextInputWrapper.defaultProps = {}

TextInputWrapper.propTypes = {
  onChangeText: PropTypes.func,
  onSubmitEditing: PropTypes.func
}
