import React, {PureComponent } from 'react';
import { string, object  } from 'prop-types';
import { BaseEntityQuery } from 'utils/genny';
import distanceInWords from 'date-fns/distance_in_words';

class DateUtility extends PureComponent {
    static propTypes = {
        attribute: string,
        style: object,
        field: string,
        code: string,
        formatType: string
    }

    getFromNowInWords = (code, attribute, field) => { 
      /* if BECODE and ATTRIBUTE is supplied as props */
      if(code && attribute){ 
        const attributevalues = BaseEntityQuery.getBaseEntityAttribute(code, attribute);
        const dateValue = attributevalues.valueDate;
        if(dateValue) { 
          const timeAgo =  distanceInWords(dateValue, Date.now());
          return timeAgo;
        }
      }
      /* if BECODE and field is supplied as props */
      if(code && field) { 
        const fieldValue = BaseEntityQuery.getBaseEntityField(code , field);  
        if(fieldValue) { 
          const timeAgo =  distanceInWords(fieldValue, Date.now());
          return timeAgo;
        }
      }
      return null;
    }

    /* choose the type of formatting to apply and call the function accordingly */
    formatSelection (code, attribute, field, formatType){ 
      switch (formatType) { 
        case 'time-ago-in-words':
          return this.getFromNowInWords(code, attribute,field);
        default: 
          return this.getFromNowInWords(code, attribute,field);
      }
    }

    render() {
      const {style, code, attribute, field, formatType} = this.props;
        const componentStyle = { ...style, };
        return (
          <span className="time-ago-in-words" style={componentStyle}>
            {
              (code && attribute) || (code && field) ?
              this.formatSelection( code, attribute, field, formatType) :
              null
            }
          </span>
        );
    }
}

export default DateUtility;
