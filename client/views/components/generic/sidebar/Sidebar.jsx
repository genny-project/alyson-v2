import React, { Component } from 'react';
import ImageView from '../imageview/ImageView';

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

        var imageView;
        if(this.props.hasImage) {
            imageView = <ImageView
                src={this.props.src}
                caption={this.props.caption}/>
        }

        return (
            <div
                className="sidebar"
                style={style}>

                { imageView }

            </div>
        );
    }
}

export default Sidebar;
