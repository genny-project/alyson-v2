import { connect } from 'react-redux';
import GennyNotification from './GennyNotification.jsx';

function mapStateToProps(state) {
  return { notifications: state.notification.data }
}

function mapDispatchToProps(dispatch) {
    return({
        sendTheAlert: () => {dispatch(ALERT_ACTION)}
    })
}

export default connect( mapStateToProps, mapDispatchToProps )( GennyNotification );
