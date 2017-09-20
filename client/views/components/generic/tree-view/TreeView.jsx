import React, { Component } from 'react';

class TreeView extends Component {

    renderItem(item) {

        return (
            <li>{item}</li>
        );
    }

    render() {

        const style = {
            ... this.props.style,
            "display": "flex",
            "flexDirection": "column",
            "textAlign": "left"
        };

        const styleli = {
            "listStyle": "none"
        };

        const styleDiv = {
            "paddingBottom": "20px",
            "display": "flex",
            "alignItems": "center",
            "justifyContent": "space-between",
            "padding-right": "20px"
        };

        return (
            <ul style={style}>
                {this.props.items.map(item => {
                    return (
                        <div style={styleDiv}>
                            <li style={styleli}>
                                {item}
                            </li>
                            <i className="material-icons">chevron_right</i>
                        </div>
                    );
                })}
            </ul>
        );
    }

}

export default TreeView;
