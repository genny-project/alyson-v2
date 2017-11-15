import React, { Component } from 'react';
import { Text, View } from 'react-native';



const Span = (props) => {
  return(
    <View> 
    <Text> {props.text}</Text>
    </View>
  );
};

export default Span;
\