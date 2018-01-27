import './GennyMessaging.scss';
import React, { Component } from 'react';
import { string, number, bool, array } from 'prop-types';
import { List, GennyForm } from 'views/components';
import { BaseEntityQuery } from 'utils/genny';
import { LayoutLoader } from 'utils/genny/layout-loader';
import { Grid } from '@genny-project/layson';

class GennyList extends Component {

    static defaultProps = {
    }

    static propTypes = {
    };

    state = {

    }

    render() {

        const { root } = this.props;

        return (
            <div className="genny-messaging-container">
                <Grid rows={1} cols={[1, 2]}>
                    <GennyList position={[0, 0]} root={root}/>
                    <GennyList position={[0, 1]} />
                </Grid>
            </div>
        );
    }
}

export default GennyList;
