import React, { Component } from 'react';
import { ImageView } from './ImageView';

class Sidebar extends Component {

    constructor() {
        super()
        this.state = {
            'open': true
        };
    }

    render() {

        const style = {
            ...this.props.style,
            "height": "100vh"
        };

        var imageView = null;
        if(this.props.hasImage) {
            imageView = <ImageView src={this.props.src} />
        }

        return (
            <div
                className="sidebar"
                style={style}>

                {/* {imageView} */}

            </div>
        );
    }
}

export default Sidebar;
