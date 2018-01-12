import './appHolder.scss';
import React, { Component } from 'react';
import { Sidebar, Header, Footer, IconSmall, GennyTable, GennyBucketView, GennyList, GennyForm, GennyHeader } from 'views/components';
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

    componentDidMount() {

        if ( document.getElementById('mounting-preview') ) {
            /* Hide the loading spinner */
            document.getElementById('mounting-preview').remove();
        }

        let social_code = window.getQueryString('code');

        if(social_code && localStorage.getItem("socialredirect")) {

            let data = JSON.parse(localStorage.getItem("socialredirect"))
            if(data) {
                data.value = social_code;
                GennyBridge.sendAnswer([data]);
                localStorage.setItem("socialredirect", '');
            }
       }
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
