import React, { Component } from 'react';

class ImageView extends Component {

    render() {

        var caption = null;
        if(this.props.caption) {
            caption = <p> {this.props.caption} </p>;
        }

        return (
            <div className="imageView">
                <img src={this.props.src} />
                {caption}
            </div>
        );
    }

}

export default ImageView;
