import './inputAddress.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import { Label, SubmitStatusIcon, Dropdown, MapInput, Button } from 'views/components';
import { Grid } from '@genny-project/layson';
import PlacesAutocomplete from 'react-places-autocomplete'
import { geocodeByAddress, geocodeByPlaceId } from 'react-places-autocomplete'

class InputAddress extends Component {

    static defaultProps = {
        className: '',
    }

    static propTypes = {
        className: string,
        style: object,
    }

    state = {
        address: this.props.value || '',
        value: this.props.value || '',
        hasChanges: false,
        showMap: false,
    }

    onSelect = (newAddress) => {
        
        if(newAddress) {

            geocodeByAddress(newAddress)
            .then(results => {
                
                let addressObj = results[0];

                let requiredFields = ['street_number','route','locality','administrative_area_level_1','postal_code','country'];

                let resultObj = {};
                let streetAddress = {};

                requiredFields.forEach((f) => {

                    addressObj.address_components.forEach((a) => {
                    
                        if (a.types.includes(f)) {

                            if (a.types.includes('street_number')) {
                                streetAddress['street_number'] = a.long_name;
                            }
                            else if (a.types.includes('route')) {
                                streetAddress['street_name'] = a.long_name;
                            }
                            else if (a.types.includes('locality')) {
                                resultObj['suburb'] = a.long_name;
                            }
                            else if (a.types.includes('administrative_area_level_1')) {
                                resultObj['state'] = a.long_name;
                            }
                            else if (a.types.includes('postal_code')) {
                                resultObj['postal_code'] = a.long_name;
                            }
                            else if (a.types.includes('country')) {
                                resultObj['country'] = a.long_name;
                            }
                        }

                        if (streetAddress.street_number && streetAddress.street_name) {
                            resultObj['street_address'] = streetAddress['street_number'] + ' ' + streetAddress['street_name'];
                        }

                    });
                });

                this.updateAddressProp(results[0].formatted_address);

                // send answer
                this.onBlur(resultObj);
            })
        }
    }

    updateAddressProp = (newAddress) => {
        this.setState({
            address: newAddress,
            value: newAddress
        });
    }
    
    onChange = (newAddress) => {
        this.setState({
            value: newAddress,
            hasChanges: true
        });
    }

    onBlur = (address) => {
        const { validationList, validation, identifier } = this.props;
        const value = JSON.stringify(address);
        if(validation) validation(value, identifier, validationList);
    }

    showMap = () => {

        this.setState({
            showMap: !this.state.showMap
        })
    }

    renderInput() {

        const { style, name, optional } = this.props;
        const { showMap } = this.state;
        const componentStyle = { ...style, };

        const inputProps = {
            value: this.state.value,
            onChange: this.onChange,
            placeholder: this.props.placeholder
        };

        const classes = {
            root: "input-address-search",
        };

        return (
            <Grid cols={
                    [
                        {
                            style: {
                                flexGrow: 5,
                                paddingRight: '10px'
                            }
                        },
                        1
                    ]
                } 
                rows="1"
            >
                <PlacesAutocomplete onSelect={this.onSelect} position={[0, 0]} inputProps={inputProps} classNames={classes} style={{zIndex: 100}}/>
                <Button position={[0, 1]} onClick={this.showMap}>{showMap ? "Hide Map" : "Show on Map"}</Button>
            </Grid>
        )
    }

    render() {

        const { name, optional,  } = this.props;
        const { validationStatus, showMap, address  } = this.state;

        return (
            <div className="input input-address">
                <div className="input-header">
                  {name ? <Label text={name} /> : null }
                  {optional ? <Label text="(optional)" /> : null}
                  <SubmitStatusIcon status={validationStatus} />
                </div>
                {window.google ? this.renderInput() : <p>Loading...</p>}
                <Dropdown inline={true} open={showMap} style={{ marginTop: '10px'}}>
                    <MapInput 
                        handleUpdate={this.onSelect}
                        style={{
                            "height": "300px",
                            "width": "100%"
                        }}
                        address={address}
                        hideInput
                    />
                </Dropdown>
            </div>
        )
    }
}

export default InputAddress;