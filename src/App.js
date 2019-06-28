import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import EnhancedTable from './Components/EnhancedTable';
import Container from '@material-ui/core/container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { connect } from 'react-redux';
import { fetchAllTokens } from './tokenActions';
import './App.css';

class App extends PureComponent {

  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object)
  }

  componentWillMount() {
    this.props.fetchAllTokens();
  }

  render() {
    const { data } = this.props;
    return (
      <Fragment>
        <CssBaseline />
        <Container maxWidth="xl">
          {data.length > 0 && <EnhancedTable data={data} />}
        </Container>
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  data: state.tokens.allTokens
});

const mapDispatchToProps = dispatch => {
  return {
    fetchAllTokens: () => dispatch(fetchAllTokens()),
    dispatch
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(App);
