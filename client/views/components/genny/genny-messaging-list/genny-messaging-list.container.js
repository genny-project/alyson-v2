import { connect } from 'react-redux';
import GennyMessagingList from './GennyMessagingList';

function mapStateToProps(state) {
  return { baseEntity: state.baseEntity, sublayout: state.layouts.sublayout  };
}

export default connect( mapStateToProps, null )( GennyMessagingList );
