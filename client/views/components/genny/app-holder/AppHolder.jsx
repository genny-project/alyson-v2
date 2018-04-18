import './appHolder.scss';
import React, { Component } from 'react';
import { any } from 'prop-types';
import { Grid } from '@genny-project/layson';
import { LayoutLoader } from 'utils/genny/layout-loader';
import { GennyBridge } from 'utils/genny';

class AppHolder extends Component {

    static defaultProps = {
    }

    static propTypes = {
        children: any,
    };

    state = {
    }

    readURL() {

        let social_code = window.getQueryString('code');
        if(social_code && localStorage.getItem("socialredirect")) {

            let data = JSON.parse(localStorage.getItem("socialredirect"))
            if(data) {
                data.value = social_code;
                GennyBridge.sendAnswer([data]);
                localStorage.setItem("socialredirect", '');
            }
        }
        let state = window.getQueryString('state'); //localhost:3000/?state=eyJsb2FkaW5nIjoiTG9hZGluZyB5b3VyIGRvY3VtZW50cy4uLiIsImV2dF90eXBlIjoiUkVESVJFQ1RfRVZFTlQiLCJkYXRhIjp7Iml0ZW1Db2RlIjoiQkVHXzAwMDEifX0=
        if(state != null) {

            const decodedState = atob(state);
            if(decodedState != null) {
                try {

                    const json = JSON.parse(decodedState);
                    if(json != null && json.data != null && json.evt_type == "REDIRECT_EVENT") {
                        GennyBridge.sendRedirectEvent(json.data);
                    }

                    /* TODO: json.loading (optional) contains a text to show instead of showing the interface if necessary */
                }
                catch( e ) {
                    console.log(' could not decode state ');
                }
            }
        }
    }

    componentDidMount() {

        if ( document.getElementById('mounting-preview') ) {
            /* Hide the loading spinner */
            document.getElementById('mounting-preview').remove();
        }

        this.readURL();

        /* let BE know user will go away */
        window.addEventListener("beforeunload", function (event) {

            GennyBridge.sendBtnClick('USER_GO_OFFLINE', {});
            event.preventDefault();
        });
    }

    render() {

        const { children, cols, rows, style } = this.props;

        const componentStyle = { ...style, backgroundColor: "white"};

        return (
            <div className={`app-holder ${window.getScreenSize()}`}>
                <Grid style={componentStyle} cols={cols} rows={rows}>
                    {children}
                </Grid>
            </div>
        );
    }
}

export default AppHolder;
