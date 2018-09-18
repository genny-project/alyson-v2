import './ImageView.scss';
import React, { Component } from 'react';
import { string, any, bool, func, object } from 'prop-types';
// import loadImage from 'blueimp-load-image';
// import ExifOrientationImg from 'react-exif-orientation-img';
import { GennyBridge, BaseEntityQuery } from 'utils/genny';

class ImageView extends Component {

    static propTypes = {
        caption: any,
        src: string,
        placeholder: string,
        rounded: bool,
        onClick: func,
        style: object,
        className: string,
        imageStyle: object,
    };

    state = {
        error: false,
    }

    onError = () => {
        this.setState({
            error: true,
        });
    }

    render() {

        const { caption, onClick, style, placeholder, rounded, className, imageStyle } = this.props;
        let { src, proxyUrl } = this.props;
        let { error } = this.state;

        const componentStyle = {
            ...style,
        };

        if(error == false && (src === "" || src == null)) error = true;

        if(proxyUrl == null) {

            // proxy URL if any
            const project_code = GennyBridge.getProject();
            if(project_code != null) {
                const proxyUrlBe = BaseEntityQuery.getBaseEntityAttribute(project_code, 'PRI_IMAGE_PROXY_URL');
                proxyUrl = proxyUrlBe && proxyUrlBe.value;
            }
        }

        if(proxyUrl != null) {

            let proxy = proxyUrl;
            if(proxy.endsWith("/")) {
              proxy = proxy.slice(0, -1);
            }

            src = `${proxy}/${src}`;
        }

        return (
            <div className={`imageView ${rounded ? 'rounded' : ''} ${className}`} style={componentStyle} onClick={onClick}>
                <div name="imgCanvas" style={imageStyle}/>
                {
                    error ? <img style={imageStyle} src={"https://i.imgur.com/FKJV3fp.jpg"} onError={this.onError} onClick={onClick} /> : <img src={src} />
                }
                { caption ? <span style={{ alignSelf: 'center' }}>{caption}</span> : null }
            </div>
        );
    }
}

export default ImageView;
