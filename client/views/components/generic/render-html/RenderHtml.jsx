import React, {Component} from 'react';
import pp from 'html-to-react';
import {any} from 'prop-types';
const HtmlToReactParser = pp.Parser;
const htmlToReactParser = new HtmlToReactParser();


class RenderHtml extends Component { 
  static propTypes = { 
    content: any
  }

  render() {
    const {content} = this.props;
    return (
      <div> 
        { content && htmlToReactParser.parse(content) }
      </div>
    );
  }
}

export default RenderHtml;