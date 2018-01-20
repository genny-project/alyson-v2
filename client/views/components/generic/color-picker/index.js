import { connect } from 'react-redux';
import ColorPicker from './ColorPicker.jsx';

function mapStateToProps(state) {
  return { layouts: state.layouts };
}

export default connect( mapStateToProps, null )( ColorPicker );
