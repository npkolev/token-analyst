import React, { PureComponent } from 'react';
import { react as autoBind } from 'auto-bind';
import PropTypes from 'prop-types';
import { withRouter } from "react-router-dom";
import { connect } from 'react-redux';
import { fetchToken } from '../tokenActions';

import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/container';
import CssBaseline from '@material-ui/core/CssBaseline';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import CircularProgress from '@material-ui/core/CircularProgress';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

function TabContainer(props) {
    return (
        <Typography component="div">
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  });

const classes = makeStyles(theme => ({
    tabRoot: {
        flexGrow: 1,
        width: '100%',
        backgroundColor: theme.palette.background.paper,
    },
    root: {
        width: '100%',
        marginTop: theme.spacing(3),
    },
    table: {
        minWidth: 650,
    },
    progress: {
        margin: theme.spacing(2),
    },
}));

class TokenDetails extends PureComponent {
    constructor(props) {
        super(props);
        autoBind(this);
    }

    state = {
        data: [],
        value: 0
    }

    componentDidMount() {
        const token = this.props.match.params.token;
        this.props.dispatch(fetchToken(token));
    }


    handleChange(event, newValue) {
        this.setState({ value: newValue });
    }

    handleChangeIndex(index) {
        this.setState({ value: index });
    }
    render() {
        const { data } = this.props;
        return (
      
            <Container maxWidth="xl">
                    <CssBaseline />
                    <div className={classes.tabRoot} style={{ paddingTop: 8 * 4 }}>
                        <AppBar position="static" color="default">
                            <Tabs
                                value={this.state.value}
                                onChange={this.handleChange}
                                indicatorColor="primary"
                                textColor="primary"
                                variant="scrollable"
                                scrollButtons="auto"
                            >
                                <Tab label="Transaction Count" />
                                <Tab label="Transaction Volume" />
                            </Tabs>
                        </AppBar>
                    </div>

                    {this.state.value === 0 && <TabContainer>
                        {data.count && (<Paper className={classes.root}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Token Address</TableCell>
                                        <TableCell>Transaction Date</TableCell>
                                        <TableCell>Number of Token Transfers</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.count.map((row, index) => (
                                        <TableRow key={row.tokenaddress + index}>
                                            <TableCell component="th" scope="row">
                                                {row.tokenaddress}
                                            </TableCell>
                                            <TableCell>{row.date}</TableCell>
                                            <TableCell>{row.number_of_token_transfers}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                        )}
                    </TabContainer>
                    }
                    {this.state.value === 1 && <TabContainer>
                        {data.volume && (<Paper className={classes.root}>
                            <Table className={classes.table}>
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Volume</TableCell>
                                        <TableCell>Volume Date</TableCell>
                                        <TableCell>Price (USD)</TableCell>
                                        <TableCell>Volume (USD)</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {data.volume.map((row, index) => (
                                        <TableRow key={row.address + index}>
                                            <TableCell>
                                                {Math.round(row.volume)}
                                            </TableCell>
                                            <TableCell>{row.date}</TableCell>
                                            <TableCell>{formatter.format(row.price_usd)}</TableCell>
                                            <TableCell>{formatter.format(row.volume_usd)}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Paper>
                        )}
                    </TabContainer>
                    }
                    {!data.count && <CircularProgress style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                    }} className={classes.progress} />}
                    </Container>
        );
    }
}

const mapStateToProps = state => ({
    data: state.tokens.activeToken
});

const mapDispatchToProps = dispatch => {
    return {
        fetchToken: (token) => dispatch(fetchToken(token)),
        dispatch
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(TokenDetails));