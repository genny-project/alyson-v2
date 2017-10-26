import React, { Component } from 'react';
import { connect } from 'react-redux';

class BaseEntityQuery extends Component {

    constructor(props) {
        super(props);
    }


    helloWorld = (code) => {
    }

    getChildrens = () => {
        const entities = this.props.baseEntity.data;
        const entitiesArr = Object.keys(entities).map(key => entities[key]);
        // return entitiesArr;
    }

    // Get the Roots Children
    getRootChildren() {
        let items = this.props.baseEntity.relationships ? Object.keys(this.props.baseEntity.relationships).map(key => this.props.baseEntity.relationships[key]) : [];
    }

    getEntityChildren(code) {

        const relationships = this.props.baseEntity.relationships[code];
        let items = relationships ? Object.keys(relationships).filter(key => relationships[key]).map(code => this.props.baseEntity.data[code]) : [];

        items = items.map(item => {
            const children = this.getEntityChildren(item.code);
            item.children = children;
            return item;
        });

        return items;
    }

    getBaseEntity(code) {
        return this.props.baseEntity.data[code];
    }

    getAlias = (code) => {

        let layout = [];

        // check aliases if any for passed entities
        for (let entity_code_key in code) {

            let baseEntity = this.props.baseEntity.data;
            for (let key in baseEntity) {

                // if we find the base entity we are looking for
                if (key === entity_code_key) {

                    // we loop through all the attributes to find the ones we want
                    code[entity_code_key].forEach(attribute => {

                        let be = this.props.baseEntity.data[key];

                        // we loop through attributes
                        be.attributes.forEach(be_attribute => {

                            if (be_attribute.code === attribute) {
                                layout.push(
                                    <p>{be_attribute.value}</p>
                                );
                            }
                        });
                    });
                }
            }
        }

        return layout;
    }

    render() {
        // console.log(this.getChildren());
        return (
            <div>
                <h1> Base entity query element </h1>
            </div>
        );
    }
}

const mapStateTopProps = (state) => ({
    data: state.baseEntity
});

export default BaseEntityQuery;
