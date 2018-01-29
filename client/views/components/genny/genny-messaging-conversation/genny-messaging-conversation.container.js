import { connect } from 'react-redux';
import GennyMessagingConversation from './GennyMessagingConversation';

function mapStateToProps(state) {
  return { baseEntity: state.baseEntity, sublayout: state.layouts.sublayout  };
}

export default connect( mapStateToProps, null )( GennyMessagingConversation );
