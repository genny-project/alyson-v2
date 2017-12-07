import './appHolder.scss';
import React, { Component } from 'react';
import { Sidebar, Header, Footer, IconSmall, GennyTable, GennyBucketView, GennyList, GennyForm, GennyHeader } from '../../';
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
        let data_string = window.getQueryString("state");

        if(social_code) {

           if(data_string) {

               let data = JSON.parse(decodeURIComponent(data_string));
               if(data) {
                   data.value = social_code;
                   GennyBridge.sendAnswer([data]);
               }
           }
       }
    }

    render() {

        const { children, cols, rows } = this.props;

        return (
            <div className={`app-holder ${window.getScreenSize()}`}>
                <Grid style={{backgroundColor: "white"}} cols={cols} rows={rows}>
                    {children}
                </Grid>
            </div>
        );
    }
}

export default AppHolder;
