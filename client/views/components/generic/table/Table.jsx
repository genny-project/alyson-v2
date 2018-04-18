import 'react-table/react-table.css';
import './table.scss';
import React, { Component } from 'react';
import { string, array, number, bool, any } from 'prop-types';
import ReactTable from 'react-table';
import { IconSmall, } from 'views/components';

class Table extends Component {

    static defaultProps = {
        className: '',
        columns: [],
        data: [],
        itemsPerPage: 10,
        tBodyStyle: false,
    }

    static propTypes = {
        className: string,
        columns: array,
        data: array,
        itemsPerPage: number,
        bodyHeight: any,
    }

    //createProps = key => (state, rowInfo, column) => {
    createProps = key => () => {
        const {bodyHeight} = this.props;
        const props = {
            tBodyStyle: { style: {height: bodyHeight, overflow: 'scroll'}},
        };
        if (props[key] && bodyHeight) {
            return props[key];
        } else {
            return {};
        }
    }

    render() {
        const { columns, data, itemsPerPage, } = this.props;
        console.log(itemsPerPage);
        console.log(data);
        return (
            <ReactTable
                getTdProps={this.createProps( 'tdStyle' )}
                getTrProps={this.createProps( 'trStyle' )}
                getTrGroupProps={this.createProps( 'trGroupStyle' )}
                getTbodyProps={this.createProps( 'tBodyStyle' )}
                getTableProps={this.createProps( 'tableStyle' )}
                getPaginationProps={this.createProps( 'paginateStyle' )}
                getTheadFilterProps={this.createProps( 'tHeadFilterStyle' )}
                getTheadProps={this.createProps( 'tHeadStyle' )}
                showPageSizeOptions={false}
                PreviousComponent={(props) => (
                    <IconSmall {...props} className='table-prev' name='chevron_left' />
                )}
                NextComponent={(props) => (
                    <IconSmall {...props} className='table-next' name='chevron_right' />
                )}
                noDataText='No data to display.'
                data={data}
                columns={columns}
                //defaultPageSize={itemsPerPage}
                defaultPageSize={10}
                className='table -striped -highlight'
                filterable={true}
                //resizable={false}
                //showPagination={ data.length > itemsPerPage ? true : false}
                showPagination={ true}
            />
        );
    }
}

export default Table;
