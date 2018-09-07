import './inputAddress.scss';
import React, { Component } from 'react';
import { string, object, array, func, bool } from 'prop-types';
import { Label, SubmitStatusIcon, Dropdown, MapInput, Button, } from 'views/components';
import { Grid } from '@genny-project/layson';
import { geocodeByAddress } from 'react-places-autocomplete';
import PlacesAutocomplete from 'react-places-autocomplete';

class InputAddress extends Component {

    static defaultProps = {
        className: '',
        hideMap: false,
    }

    static propTypes = {
        className: string,
        style: object,
        value: string,
        validationList: array,
        identifier: string,
        name: string,
        validation: func,
        placeholder: string,
        mandatory: bool,
        validationStatus: string,
        hideMap: bool,
    }

    state = {
        address: this.props.value || '',
        value: this.props.value || '',
        hasChanges: false,
        showMap: false,
        coords: null,
        error: null
    }

    componentWillReceiveProps( nextProps) {
        // console.log(nextProps.value, this.props.value, this.state.value, this.state.address,)
        if (
            nextProps.value != this.props.value &&
            nextProps.value != this.state.value &&
            typeof nextProps.value == 'string'
            
        ) {
            // console.log('newprop')
            this.setState({
                address: nextProps.value,
                value: nextProps.value
            }, () => {
                this.onSelect(this.state.address);
            });
        }
    }

    onSelect = (newAddress) => {

        if(newAddress) {

            geocodeByAddress(newAddress)
            .then(results => {

                let addressObj = results[0];

                this.setState({
                    coords: {
                        lat: results[0].geometry.location.lat(),
                        lng: results[0].geometry.location.lng(),
                    }
                });

                let requiredFields = ['street_number','route', 'locality','administrative_area_level_1','postal_code','country'];

                let resultObj = {};
                let streetAddress = {};

                requiredFields.forEach((field) => {

                    addressObj.address_components.forEach((address) => {

                        if (address.types.includes(field)) {

                            if (address.types.includes('street_number')) {
                                streetAddress['street_number'] = address.long_name;
                            }
                            else if (address.types.includes('route')) {
                                streetAddress['street_name'] = address.long_name;
                            }
                            else if (address.types.includes('locality')) {
                                resultObj['suburb'] = address.long_name;
                            }
                            else if (address.types.includes('administrative_area_level_1')) {
                                resultObj['state'] = address.short_name;
                            }
                            else if (address.types.includes('postal_code')) {
                                resultObj['postal_code'] = address.long_name;
                            }
                            else if (address.types.includes('country')) {
                                resultObj['country'] = address.short_name;
                            }
                        }

                        if (streetAddress.street_number && streetAddress.street_name) {
                            resultObj['street_address'] = streetAddress['street_number'] + ' ' + streetAddress['street_name'];
                        }
                    });
                });

                resultObj['full_address'] = results[0].formatted_address;
                resultObj['latitude'] = results[0].geometry.location.lat();
                resultObj['longitude'] = results[0].geometry.location.lng();

                const requiredKeys = ['suburb', 'state'];

                let hasFields = requiredKeys.every(required_key => {

                    let isAnyTrue = false;
                    Object.keys(resultObj).map(key => {
                        if (key.includes(required_key)) {
                            isAnyTrue = true;
                        }
                    });
                    return isAnyTrue;
                });

                if ( hasFields == true ) {
                    this.setState({
                        error: null
                    });

                    this.updateAddressProp(results[0].formatted_address);

                    // send answer
                    this.onBlur(resultObj);
                }
                else {
                    this.setAlert('Address must contain a suburb and a state');
                }
            });
        }
    }

    setAlert = (text) => {
        this.setState({
            error: text
        });
    }

    updateAddressProp = (newAddress) => {
        this.setState({
            address: newAddress,
            value: newAddress
        });
    }

    onChange = (newAddress) => {

        //this.checkIfVisible();

        if(this.props.onFocus) {
            this.props.onFocus();
        }

        this.setState({
            value: newAddress,
            hasChanges: true
        });
    }

    onFocus = () => {
        if(this.props.onFocus) {
            this.props.onFocus();
        }
    }

    onBlur = (address) => {

        if(this.props.onBlur) {
            this.props.onBlur(address);
        }

        const { validationList, validation, identifier } = this.props;
        const value = JSON.stringify(address);
        if(validation) validation(value, identifier, validationList);
    }

    showMap = () => {

        this.setState({
            showMap: !this.state.showMap
        });
    }

    // checkIfVisible = () => {
    //     let element = document.getElementsByClassName('address-results-container');
    //     if (element && element[0]) {
    //         let bounding = element[0].getBoundingClientRect();
    //         let height = element[0].clientHeight;
    //         console.log(height);
    //         console.log(bounding.top, bounding.bottom);
    //         if (
    //             bounding.top >= 0 &&
    //             bounding.bottom <= (window.innerHeight || document.documentElement.clientHeight)
    //         ) {
    //             this.setState({
    //                 isVisible: true
    //             });
    //         } else {
    //             this.setState({
    //                 isVisible: false
    //             });
    //         }
    //     }
    //     return null;
    // }



    renderInput() {
        const { hideMap } = this.props;
        const { showMap } = this.state;

        const inputProps = {
            value: this.state.value,
            onChange: this.onChange,
            placeholder: this.props.placeholder,
            onFocus: this.onFocus,
            onBlur: this.props.onBlur
        };

        const classes = {
            root: 'input-address-search',
            autocompleteContainer: 'address-results-container',
            input: 'input-field'
        };

        // const options = {
        //     componentRestrictions: {
        //         country: 'au'
        //     }
        // };

        const searchOptions = {
            types: ['address']
        }

        if (window.getScreenSize() == 'sm') {
            return (
                <Grid cols={1} rows={1}>
                    <PlacesAutocomplete
                        onSelect={this.onSelect}
                        position={[0, 0]}
                        inputProps={inputProps}
                        classNames={classes}
                        searchOptions={searchOptions}
                        style={{zIndex: 100}}/>
                </Grid>
            );
        } else {
            return (
                    hideMap
                        ? <PlacesAutocomplete
                            searchOptions={searchOptions}
                            onSelect={this.onSelect}
                            inputProps={inputProps}
                            classNames={classes}
                            style={{zIndex: 100}}
                        />
                        :   <Grid cols={
                            [
                                {
                                    style: {
                                        flexGrow: 5,
                                        paddingRight: '10px'
                                    }
                                },
                                {
                                    style: {
                                        flex: '0 0 100px'
                                    }
                                },
                            ]
                        }
                        rows="1"
                    >
                        <PlacesAutocomplete searchOptions={searchOptions} onSelect={this.onSelect} position={[0, 0]} inputProps={inputProps} classNames={classes} style={{zIndex: 100}}/>
                        <Button position={[0, 1]} onClick={this.showMap}>{showMap ? 'Hide Map' : 'Show on Map'}</Button>
                    </Grid>
            );
        }
    }

    render() {

        const { name, mandatory, validationStatus, className, hideMap } = this.props;
        const { showMap, address, coords, error } = this.state;

        return (
            <div className={`input input-address ${className} ${error ? 'error' : validationStatus}` }>
                <div className="input-header">
                    {name ? <Label text={name} /> : null }
                    {mandatory ? <Label className='input-label-required' textStyle={ !validationStatus || error ? {color: '#cc0000'} : null} text="*  required" /> : null}
                    <SubmitStatusIcon status={error ? 'error' : validationStatus} style={{marginLeft: '5px'}}/>
                </div>
                {window.google ? this.renderInput() : <p>Loading...</p>}
                { this.state.error ?
                    <div className='input-address-error'>{this.state.error}</div>
                : null }
                { !hideMap && window.getScreenSize() == 'sm' && <Button onClick={this.showMap} style={{marginTop: '10px'}}>{showMap ? 'Hide Map' : 'Show on Map'}</Button> }
                {
                    !hideMap && 
                    <Dropdown inline={true} open={showMap} style={{ marginTop: '10px'}}>
                        <MapInput
                            handleUpdate={this.onSelect}
                            style={{
                                'height': '300px',
                                'width': '100%'
                            }}
                            address={address}
                            lat={coords && coords.lat}
                            lng={coords && coords.lng}
                            hideInput
                        />
                    </Dropdown>
                }
            </div>
        );
    }
}

export default InputAddress;
