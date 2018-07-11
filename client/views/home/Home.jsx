import './home.scss';
import React, { Component } from 'react';
import { LayoutLoader } from 'utils/genny/layout-loader';
import { BaseEntityQuery } from 'utils/genny/'
import TagManager from 'react-gtm-module';

class Home extends Component {

    setupGoogleAPI() {

        let googleScript = document.getElementById('google-api');
        let apiKey = BaseEntityQuery.getAliasAttribute('PROJECT', 'PRI_GOOGLE_API_KEY');

        if(!googleScript && apiKey && apiKey.value) {

            let apiString = 'https://maps.googleapis.com/maps/api/js?key=' + apiKey.value + '&libraries=places';
            // load google api
            //TODO: move the API key to config file
            const script = document.createElement('script');
            script.src = apiString;
            script.async = true;
            script.id = 'google-api';
            document.body.appendChild(script);
        }
    }

    setupGoogleTagManager() {

        /* we check if we have already set it up */
        let gtmID = BaseEntityQuery.getAliasAttribute('PROJECT', 'PRI_GOOGLE_GTM_ID');
        let googleGTM = document.getElementById('google-tag-manager');

        if(!googleGTM && gtmID && gtmID.value) {

            const divGTM = document.createElement('div');
            divGTM.id = 'google-tag-manager';
            document.body.appendChild(divGTM);

            const tagManagerArgs = {
                gtmId: gtmID.value
            }

            TagManager.initialize(tagManagerArgs)
        }
    }

    render() {

        const { layouts, } = this.props;

        /* Get the current layout */
        const { current, loaded } = layouts;

        this.setupGoogleAPI();
        this.setupGoogleTagManager();

        /* If the current layout is null or this layout hasn't been loaded display a LayoutNotFound page */
        if ( !current ) {
            return null;
        }

        if ( loaded[current] == null ) {
            return <div>Layout not found./</div>
        }

        return (
            <div className="home">
                <LayoutLoader layout={loaded[current]} />
            </div>
        );
    }
}



export default Home;
