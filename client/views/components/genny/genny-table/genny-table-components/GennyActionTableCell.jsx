import React, { Component } from 'react';
import { string, object } from 'prop-types';
import { ImageView } from 'views/components';
import { LayoutLoader } from 'utils/genny/layout-loader';
import { BaseEntityQuery } from 'utils/genny';

class GennyActionTableCell extends Component {

    static defaultProps = {
        original: {},
        value: '',
        dataType: '',
    }

    static propTypes = {
        original: object,
        value: string,
        dataType: string,
    }

    renderAction = (buttonAction, be) => {
        return <LayoutLoader layout={{ layout: [buttonAction]}} localAliases={{ BE: be }} />
    }

    render() {

        const { original, value } = this.props;

        let buttonActions = original.actions.value;
        const baseEntityCode = original.baseEntityCode;

        if(baseEntityCode) {

            const be = BaseEntityQuery.getBaseEntity(baseEntityCode);
            console.log(be);

            if(be) {

                return (
                    <span
                        style={{
                        fontSize: '14px',
                        }}>
                        {
                            buttonActions ? buttonActions.map(buttonAction => this.renderAction(buttonAction, be)) : null
                        }
                    </span>
                );
            }
        }

        return null;
    }

}

export default GennyActionTableCell;
