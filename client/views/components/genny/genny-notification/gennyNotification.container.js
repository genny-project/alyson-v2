import { connect } from 'react-redux';
import GennyNotification from './GennyNotification.jsx';

function mapStateToProps(state) {
  return { notifications: state.notification.data }
}

export default connect( mapStateToProps )( GennyNotification );
