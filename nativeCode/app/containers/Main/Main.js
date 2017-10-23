import React from 'react';
import { View, Text } from 'react-native';
import { GennyBridge } from 'utils/genny';

import styles from './styles';

class Main extends React.Component {

    state = {
        latitude: 0,
        longitude: 0
    }

    static navigationOptions = () => ({
        title: 'GPS',
        headerStyle: { backgroundColor: 'orange' },
        headerTintColor: 'white'
    })

    componentDidMount() {
        this.watchId = navigator.geolocation.watchPosition(
            (position) => {
                this.setState({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude
                });
                console.log('lat ' + position.coords.latitude);
                console.log('lon ' + position.coords.longitude);

                const data = {
                    'msg_type': 'DATA_MSG',
                    'data_type': 'GPS',
                    'delete': false,
                    'items': [
                        {
                            'id': null,
                            'created': '2017-10-12\'T\'17:00:00',
                            'latitude': position.coords.latitude,
                            'longitude': position.coords.longitude,
                            'bearing': '0',
                            'targetCode': 'PER_USER1'
                        }
                    ]
                };
                
                GennyBridge.initVertx('http://192.168.1.4:8088/frontend');
                GennyBridge.sendMessage('DATA_MSG', data, '');
            },
            (error) => {
                console.log('error ', error.message);
            },
            {
                timeout: 20000,
                maximumAge: 1000,
                distanceFilter: 10,
                enableHighAccuracy: false
            }
        );
    }

    componentWillUnmount() {
        navigator.geolocation.clearWatch(this.watchId);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text>{this.state.latitude + ', ' + this.state.longitude}</Text>
            </View>
        );
    }
}

export default Main;