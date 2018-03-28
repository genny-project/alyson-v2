import './ImageView.scss';
import React, { Component } from 'react';
import { string, any, bool, func, object } from 'prop-types';
// import loadImage from 'blueimp-load-image';
// import ExifOrientationImg from 'react-exif-orientation-img';

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

        const { caption, src, onClick, style, placeholder, rounded, className, imageStyle } = this.props;
        let { error } = this.state;

        const componentStyle = {
            ...style,
        };

        if(error == false && (src === "" || src == null)) error = true;

        return (
            <div className={`imageView ${rounded ? 'rounded' : ''} ${className}`} style={componentStyle}>
                <div name="imgCanvas" style={imageStyle} onClick={onClick} />
                {
                    error ? <img style={imageStyle} src={"https://i.imgur.com/FKJV3fp.jpg"} onError={this.onError} onClick={onClick} /> : <img src={src} />
                }
                { caption ? <span style={{ alignSelf: 'center' }}>{caption}</span> : null }
            </div>
        );
    }
}

export default ImageView;
