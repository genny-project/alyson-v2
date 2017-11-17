import './gennyList.scss';
import React, { Component } from 'react';
import { object, array } from 'prop-types';
import BaseEntityQuery from './../../../../utils/genny/BaseEntityQuery';
import { IconSmall, ListItem, List, GennyForm } from '../../';
import { GennyBridge } from 'utils/genny';
import { LayoutLoader } from 'utils/genny/layout-loader';

class GennyList extends Component {

    static propTypes = {
    };

    state = {
        columns: [],
        data: []
    }

    generateHeadersFor(baseEntities) {

        let columns = [{
            "Header": () => <div className='list-item-total'><span>{baseEntities.length} Items found</span></div>,
            "accessor": "baseEntity",
            "sortable" : "false",
            "filterable" : "false",
            "Cell": row => {

                let be = row.value;
                let beAttributes = []

                if(be.attributes) {
                    Object.keys(be.attributes).forEach(attribute_key => {
                        let attribute = be.attributes[attribute_key].value;
                        beAttributes.push(attribute);
                    })
                };
                let layout_code = "SUBLAY_1";
                let sublayout = this.props.sublayout[layout_code];
                return (
                    <ListItem>
                        { sublayout ? <LayoutLoader layout={sublayout} /> : null }
                    </ListItem>
                )
            }
        }];

        this.state.columns = columns;
        return columns;
    }

    generateDataFor(baseEntities) {

        let data = [];
        let columns = this.state.columns;
        baseEntities.forEach(baseEntity => {

            data.push({
                "baseEntity": baseEntity
            });
        });
        this.state.data = data;
        return data;
    }

    render() {

        const { root, showBaseEntity, screenSize } = this.props;

        console.log(this.props);

        let query = new BaseEntityQuery(this.props);
        let columns = [];
        let data = [];

        let children = query.getEntityChildren(root);
        if(children) {

            if(children.length == 0 && showBaseEntity) {

                let be = query.getBaseEntity(root);
                if(be) {
                    children = [be];
                }
            }

            columns = this.generateHeadersFor(children);
            data = this.generateDataFor(children);
        }

        let headerContent = <GennyForm isHorizontal />

        return (
            <div className="genny-list">
                <List
                    {...this.props}
                    header={ headerContent }
                    data={data}
                    columns={columns} />
            </div>
        );
    }
}

export default GennyList;
