import { connect } from 'react-redux';
import GennyForm from './GennyForm.jsx';

function mapStateToProps(state) {
  return {
      baseEntity: state.baseEntity,
      asks: state.ask.data,
  }
}

export default connect( mapStateToProps, null )( GennyForm );
