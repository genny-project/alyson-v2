import { connect } from 'react-redux';
import GennyPieChart from './GennyPieChart';

function mapStateToProps(state) {
  return {
    baseEntity: state.baseEntity
  };
}

export default connect(mapStateToProps, null)(GennyPieChart);
