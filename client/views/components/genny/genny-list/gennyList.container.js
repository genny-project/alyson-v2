import { connect } from 'react-redux';
import GennyList from './GennyList.jsx';

function mapStateToProps(state) {
  return {
    baseEntity: state.baseEntity,
    asks: state.ask,
    sublayout: state.layouts.sublayout,
  };
}

export default connect(mapStateToProps, null)(GennyList);
