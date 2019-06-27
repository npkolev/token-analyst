import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from "react-router-dom"
import './index.css';
import App from './App';

import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from 'redux-devtools-extension';
import { Provider } from 'react-redux';
import thunk from "redux-thunk";
import rootReducer from "./rootReducer";
import TokenDetails from './Components/TokenDetails';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import AppBar from "@material-ui/core/AppBar";
import history from "./history.js";

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk),
    ));

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" color="inherit" style={{cursor: 'pointer'}} onClick={() => history.push('/')}>
                        Token Analyst
                    </Typography>
                </Toolbar>
            </AppBar>
            <Route exact path="/" component={App} />
            <Route path="/token-details/:token" component={TokenDetails} />
        </Router>
    </Provider>,
    document.getElementById('root')
);


