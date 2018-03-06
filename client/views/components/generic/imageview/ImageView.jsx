import './ImageView.scss';
import React, { Component } from 'react';
import { string, any, bool, func, object } from 'prop-types';
import loadImage from 'blueimp-load-image';

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

    componentDidMount() {
        this.renderImage();
    }

    componentDidUpdate() {
        this.renderImage();
    }

    renderImage() {

        const { src } = this.props;
        if(src != null && src != "") {

            loadImage(
                src,
                (img) => {
                    if(img.type === "error") {
                        console.log("Error loading image " + src);
                    } else {

                        if(this.refs != null && this.refs.imgDiv != null && this.refs.imgDiv.firstChild != null)
                            this.refs.imgDiv.removeChild(this.refs.imgDiv.firstChild);

                        this.refs.imgDiv.appendChild(img);
                    }
                },
                {
                    orientation: true
                }
            );
        }
        else {

        }
    }

    render() {

        const { caption, src, onClick, style, placeholder, rounded, className, imageStyle } = this.props;
        let { error } = this.state;

        const componentStyle = {
            ...style,
        };

        if(src === "") error = true;
        return (
            <div className={`imageView ${rounded ? 'rounded' : ''} ${className}`} style={componentStyle}>
                <div name="imgCanvas" ref="imgDiv" style={imageStyle} onClick={onClick} />
                { caption ? <span style={{ alignSelf: 'center' }}>{caption}</span> : null }
            </div>
        );
    }
}

export default ImageView;
