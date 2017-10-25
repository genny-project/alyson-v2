import { connect } from 'react-redux';
import CircleButton from './CircleButton.jsx';

function mapStateToProps(state) {
  return { layouts: state.layouts }
}

export default connect( mapStateToProps, null )( CircleButton );
