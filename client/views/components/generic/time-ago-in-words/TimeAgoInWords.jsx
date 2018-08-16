import React, {PureComponent } from 'react';
import { string, object  } from 'prop-types';
import { BaseEntityQuery } from 'utils/genny';
import distanceInWords from 'date-fns/distance_in_words';

class TimeAgoInWords extends PureComponent {
    static propTypes = {
        code: string,
        style: object
    }
    renderFromNow = (code) => {
      if (code) {
        let createdAt = BaseEntityQuery.getBaseEntity(code);
        if(createdAt && createdAt.created) { 
          const date = createdAt.created;
          return distanceInWords(date, Date.now());
        }
        return null;
    }
      return null;
  }

    render() {
      const {style, code} = this.props;
        const componentStyle = { ...style, };
        return (
          <span className="time-ago-in-words" style={componentStyle}>
            {
              code ?
              this.renderFromNow( code) :
              null
            }
          </span>
        );
    }
}

export default TimeAgoInWords;
