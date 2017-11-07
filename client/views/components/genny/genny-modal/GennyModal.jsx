import './gennyModal.scss';
import React, { Component } from 'react';
import { func } from 'prop-types';
import BaseEntityQuery from './../../../../utils/genny/BaseEntityQuery';
import { Modal, } from '../../';
import { GennyBridge } from 'utils/genny';
import { LayoutLoader } from 'utils/genny/layout-loader';

class GennyModal extends Component {

    static propTypes = {
        onClick: func,
    };

    state = {
        
    }

    onClick = () => {
        this.props.onClick();
    }

    getModalContent = () => {
        let layout_code = "SUBLAY_1";
        let sublayout = this.props.sublayout[layout_code];
    
        return ( sublayout ? <LayoutLoader layout={sublayout} /> : null );
    }

    
    render() {
        const { root, showBaseEntity, onClick } = this.props;
        let query = new BaseEntityQuery(this.props);
        
        let modalContent = this.getModalContent();

        return (
            <div className="genny-modal">
                <Modal {...this.props} onClick={this.onClick}>
                    {modalContent}
                </Modal>
            </div>
        );
    }
}

export default GennyModal;
