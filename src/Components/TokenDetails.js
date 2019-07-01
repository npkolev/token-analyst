import React, { PureComponent } from 'react';
import { react as autoBind } from 'auto-bind';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { fetchToken } from '../tokenActions';
import * as d3 from "d3";

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
import Grid from '@material-ui/core/Grid';

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
        flexGrow: 1
    },
    table: {
        minWidth: 650,
    },
    progress: {
        margin: theme.spacing(2),
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
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
        this.renderTransferChart();
    }

    async renderTransferChart() {
        const { match, fetchToken } = this.props;
        await fetchToken(match.params.token);
        this.drawChart();
    }

    drawChart() {
        const { data } = this.props;
        const tokenTransfers = data && data.count.map(({ number_of_token_transfers }) => number_of_token_transfers);
        const maxTokenTransfer = Math.max(...tokenTransfers);
        const processedData = tokenTransfers.map(item => {
            return { 'y': item }
        })
        
        var margin = { top: 50, right: 80, bottom: 50, left: 50 }
            , width = (window.innerWidth - margin.left - margin.right) / 1.03// Use the window's width 
            , height = (window.innerHeight - margin.top - margin.bottom) / 1.03// Use the window's height

        const countPadding = 10

        // The number of datapoints
        var n = 30;

        var xScale = d3.scaleLinear()
            .domain([0, n]) // input
            .range([0, width]); // output

        var yScale = d3.scaleLinear()
            .domain([0, maxTokenTransfer]) // input 
            .range([height, 0]); // output 

        var line = d3.line()
            .x(function (d, i) { return xScale(i); }) // set the x values for the line generator
            .y(function (d) { return yScale(d.y); }) // set the y values for the line generator 
            .curve(d3.curveMonotoneX) // apply smoothing to the line

        const dataset = processedData;

        const svg = d3.select("#chart1").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        svg.append("g")
            .attr("class", "x axis")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale).ticks(15)); // Create an axis component with d3.axisBottom

        svg.append("g")
            .attr("class", "y axis")
            .call(d3.axisLeft(yScale)); // Create an axis component with d3.axisLeft

        svg.append("path")
            .datum(dataset)
            .attr("class", "line") // Assign a class for styling 
            .attr("d", line);

        svg.selectAll(".dot")
            .data(dataset)
            .enter()
            .append("circle") // Uses the enter().append() method
            .attr("class", "dot") // Assign a class for styling
            .attr("cx", function (d, i) { return xScale(i) })
            .attr("cy", function (d) { return yScale(d.y) })
            .attr("r", 5)

        svg.append("g").selectAll("text")
            .data(dataset)
            .enter()
            .append("text")
            .attr("x", function (d, i) { return xScale(i) - countPadding })
            .attr("y", function (d) { return yScale(d.y) - countPadding })
            .text(d => `\u00A0\u00A0\u00A0\u00A0${d.y}`)
            .attr("font-family", "Roboto")
            .attr("font-size", "14px")
            .attr("fill", "black")
            .attr("text-anchor", "middle");

        svg.append("text")
            .attr("x", (200))
            .attr("y", 10)
            .attr("text-anchor", "middle")
            .attr("font-family", "Roboto")
            .style("font-size", "18px")
            .style("font-weight", "bold")
            .style("text-decoration", "underline")
            .text("Transaction Count Per Day (last 30 days)");
    }

    handleChange(event, newValue) {
        this.setState({ value: newValue });
    }

    handleChangeIndex(index) {
        this.setState({ value: index });
    }

    render() {
        const { data } = this.props;
        const { value } = this.state;
        return (
            <Container maxWidth="xl">
                <CssBaseline />
                <div className={classes.tabRoot} style={{ paddingTop: 8 * 4 }}>
                    <AppBar position="static" color="default">
                        <Tabs
                            value={value}
                            onChange={this.handleChange}
                            indicatorColor="primary"
                            textColor="primary"
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            <Tab label="Transaction Count" onClick={this.renderTransferChart} />
                            <Tab label="Transaction Volume" />
                        </Tabs>
                    </AppBar>
                </div>
                {value === 0 && (
                    <TabContainer>
                        <div className={classes.root}>
                            <Grid container spacing={3}>
                                <Grid item xs={12}>
                                    <div  style={{marginTop: 25}}>
                                        <Paper className={classes.root} style={{padding: '24px 16px'}}>
                                            <Typography variant="h5" component="h3">
                                                Token: {data.token !== undefined && data.token.toUpperCase()}
                                            </Typography>
                                            <Typography component="p">
                                                Transaction count, date, number of tokens transfered and token address used.
                                            </Typography>
                                        </Paper>
                                    </div>
                                </Grid>
                                <Grid item xs={12}>
                                    <Paper className={classes.paper}>
                                        <div id="chart1"></div>
                                    </Paper>
                                </Grid>
                                <Grid item xs={12}>
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
                                </Grid>
                            </Grid>
                        </div>
                    </TabContainer>
                )}
                {value === 1 && <TabContainer>
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

export default connect(mapStateToProps, mapDispatchToProps)(TokenDetails);
