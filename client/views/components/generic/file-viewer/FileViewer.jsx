import './fileViewer.scss';
import React, { Component } from 'react';
import { string, object, any } from 'prop-types';
import { BaseEntityQuery } from 'utils/genny';
import {  } from 'views/components';

class FileViewer extends Component {

    static defaultProps = {
    }

    static propTypes = {
        className: string,
        style: object,
        root: string,
        attribute: string,
    }

    state = {
    }

    render() {
        const { className, root, attribute, style } = this.props;
        const {  } = this.state;
        const componentStyle = { ...style, };
        let filesArray = null;
        
        console.log(root, attribute);

        const attributeObject = BaseEntityQuery.getBaseEntityAttribute(root, attribute);

        const attributeValue = attributeObject ? attributeObject.value : null;

        console.log(attributeObject, attributeValue);

        if(attributeValue != null && attributeValue.startsWith('[')) {
            filesArray = JSON.parse(attributeValue);
        }

        console.log(filesArray);

        return (
            <div className={`file-viewer ${className}`} style={componentStyle}>
             <span>{root}</span>
            </div>
        );
    }
}

export default FileViewer;
