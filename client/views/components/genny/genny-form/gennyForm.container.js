import { connect } from 'react-redux';
import GennyForm from './GennyForm.jsx';

function mapStateToProps(state) {
  return {
      baseEntity: state.baseEntity,
      ask: state.ask
  }
}

export default connect( mapStateToProps, null )( GennyForm );
