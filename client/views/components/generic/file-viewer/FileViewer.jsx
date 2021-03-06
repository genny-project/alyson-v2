import './fileViewer.scss';
import React, { Component } from 'react';
import { string, object, bool } from 'prop-types';
import { BaseEntityQuery } from 'utils/genny';
import prettierBytes from 'prettier-bytes';
import { IconSmall } from 'views/components';

class FileViewer extends Component {

    static defaultProps = {
        displayColumn: false,
        title: null,
    }

    static propTypes = {
        className: string,
        style: object,
        root: string,
        attribute: string,
        displayColumn: bool,
        items: string,
        title: string,
    }

    state = {
    }

    getIconByFileType = fileType => {
        if (fileType.includes('image'))
            return 'image';

        if (fileType.includes('video'))
            return 'videocam';

        if (fileType.includes('audio'))
            return 'audiotrack';

        if (fileType.includes('pdf'))
            return 'picture_as_pdf';

        return 'insert_drive_file';
    }

    isValidFile = file => {
        if (!file.type) {
            return false;
        }

        if (!file.id) {
            return false;
        }

        if (!file.uploadURL) {
            return false;
        }

        if (!file.name) {
            return false;
        }

        if (!file.uploaded) {
            return false;
        }

        if (!file.size) {
            return false;
        }

        return true;
    }

    render() {

        const { className, root, attribute, style, displayColumn, items, title } = this.props;
        const componentStyle = {
            ...style,
            flexDirection: displayColumn ? 'column' : 'row'
        };

        let filesArray = null;
        let validFiles = [];

        if (
            root != null &&
            typeof root === 'string' &&
            root.length > 0 &&
            attribute != null &&
            typeof attribute === 'string' &&
            attribute.length > 0
        ) {
            const attributeObject = BaseEntityQuery.getBaseEntityAttribute(root, attribute);
            const attributeValue = attributeObject ? attributeObject.value : null;


            if(attributeValue != null && attributeValue.startsWith('[')) {
                filesArray = JSON.parse(attributeValue);
            }
            else {
                ///single file as string, from backend PDF upload
                filesArray = [
                    {
                        type: '.pdf',
                        id: attributeValue,
                        uploadURL: attributeValue,
                        name: attributeValue,
                        uploaded: attributeValue,
                        size: '-',
                    }
                ];
            }

            validFiles = filesArray && filesArray.length ? filesArray.filter(file => this.isValidFile(file)) : [];
        }

        if (
            items != null &&
            typeof items === 'string'
        ) {
            if(items != null && items.startsWith('[')) {
                filesArray = JSON.parse(items);
            }
            else {
                ///single file as string, from backend PDF upload
                filesArray = [
                    {
                        type: '.pdf',
                        id: items,
                        uploadURL: items,
                        name: items,
                        uploaded: items,
                        size: '-',
                    }
                ];
            }

            validFiles = filesArray && filesArray.length ? filesArray.filter(file => this.isValidFile(file)) : [];
            
        }

        return (
            <div className={`file-viewer ${className}`} style={componentStyle}>
                {
                    validFiles &&
                    validFiles.length > 0 && (
                        validFiles.map(file => {
                            return (
                                <a
                                    className="file-tile"
                                    key={ file.id }
                                    href={ file.uploadURL }
                                    target="_blank"
                                    rel="noopener"
                                    style={{
                                        flexBasis: displayColumn ? '80px' : '200px',
                                    }}
                                >
                                    {
                                        (
                                            file.type.includes('image') &&
                                            (
                                                !!file.preview ||
                                                !!file.uploadURL
                                            )
                                        ) ? (
                                            <img
                                            className="file-image"
                                                src={ file.uploadURL || file.preview }
                                                role="presentation"
                                            />
                                        ) : (
                                            <div className="file-preview">
                                                <IconSmall
                                                    className="file-icon"
                                                    name={this.getIconByFileType(file.type)}
                                                />
                                            </div>
                                        )
                                    }

                                    <div className="file-details">
                                        <span className="file-name" >{ title || file.name }</span>
                                        <span className="file-size">{ typeof file.size === 'number' ? prettierBytes(file.size) : file.size }</span>
                                    </div>
                                </a>
                            );
                        })
                    )
                }

            </div>
        );
    }
}

export default FileViewer;
