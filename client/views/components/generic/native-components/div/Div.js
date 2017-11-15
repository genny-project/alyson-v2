import React, { Component } from 'react';
import { Text, View } from 'react-native';


const Div = (props)=> {
  return (
    <View> 
    {props.children}
    </View>
  );
};

export default Div;
