import './home.scss';
import React, { Component } from 'react';
import { LayoutLoader } from 'utils/genny/layout-loader';

class Home extends Component {

    componentDidMount() {

    }
    render() {

        const { layouts, baseEntity } = this.props;

        /* Get the current layout */
        const { current, loaded } = layouts;

        /* If the current layout is null or this layout hasn't been loaded display a LayoutNotFound page */
        if ( !current ) {
            return null;
        }

        if ( loaded[current] == null ) {
            return <LayoutNotFound layout={current} />;
        }

        return (
            <div className="home">
                <LayoutLoader layout={loaded[current]} />
            </div>
        );
    }
}



export default Home;
