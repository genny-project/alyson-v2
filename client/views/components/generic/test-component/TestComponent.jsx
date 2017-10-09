import React, { Component } from 'react';
import { BaseEntity } from '../../../../utils/genny/';
class TestComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1> Hi from TestComponent</h1>
        <BaseEntity>
          {
            (query) => {
              return <span>{query.getRelationships('gg')}</span>;
            }
          }
        </BaseEntity>
      </div>
    );
  }
}

export default TestComponent;

