import './gennyModal.scss';
import React, { Component } from 'react';
import { func, string } from 'prop-types';
import { BaseEntityQuery } from 'utils/genny';
import { Modal, } from '../../';
import { GennyBridge } from 'utils/genny';
import { LayoutLoader } from 'utils/genny/layout-loader';

class GennyModal extends Component {

    static propTypes = {
        onClick: func,
        root: string,
    };

    state = {

    }

    onClick = () => {
        this.props.onClick();
    }

    getModalContent = (root) => {

        let layout_code = root;
        let sublayout = this.props.sublayout[layout_code];
        return ( sublayout ? <LayoutLoader layout={sublayout} /> : null );
    }

    render() {
        const { root, showBaseEntity, onClick } = this.props;
        let modalContent = root ? this.getModalContent(root) : null;

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
