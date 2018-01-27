import { connect } from 'react-redux';
import GennyList from './GennyMessaging';

function mapStateToProps(state) {
  return { baseEntity: state.baseEntity, sublayout: state.layouts.sublayout  };
}

export default connect( mapStateToProps, null )( GennyList );
