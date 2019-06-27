import React, { PureComponent, Fragment } from 'react';
import { react as autoBind } from 'auto-bind';
import './App.css';
import axios from 'axios';
import EnhancedTable from './Components/EnhancedTable';
import Container from '@material-ui/core/container';
import CssBaseline from '@material-ui/core/CssBaseline';
import { connect } from 'react-redux';
import { fetchAllTokens } from './tokenActions';

class App extends PureComponent {
  constructor(props) {
    super(props);
    autoBind(this);
  }

  state = {
    data: []
  }

  componentWillMount() {
    this.getTokenStats()
  }

  getTokenStats() {
    const URL = 'https://api.tokenanalyst.io/analytics/last?job=';
    const tokens = ['bnb', 'bat', 'gnt', 'mkr', 'omg', 'rep', 'zil', 'zrx'];
    tokens.forEach(token => {
      const transactions = axios.get(`${URL}${token}_txn_count_24h&format=json`);
      const volume = axios.get(`${URL}${token}_volume_24h&format=json`);
      axios.all([transactions, volume]).then(axios.spread((trans, vol) => {
        const count = { ...trans.data[0] };
        const volume = { ...vol.data[0] };
        this.setState({ data: this.state.data.concat({ token, count, volume }) })
      })).catch(error => {
        console.error(error);
      })
    });
    this.props.dispatch(fetchAllTokens(this.state.data));
  }

  render() {
    return (
      <Fragment>
        <CssBaseline />
        <Container maxWidth="xl">
          <EnhancedTable data={this.state.data} />
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
