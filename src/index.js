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
import SvgIcon from '@material-ui/core/SvgIcon';

function HomeIcon(props) {
    return (
        <SvgIcon {...props}>
            <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
        </SvgIcon>
    );
}

const store = createStore(
    rootReducer,
    composeWithDevTools(applyMiddleware(thunk),
    ));

ReactDOM.render(
    <Provider store={store}>
        <Router history={history}>
            <AppBar position="static">
                <Toolbar>
                    <div style={{
                        cursor: 'pointer', display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'flex-end',
                        margin: 12
                    }} onClick={() => history.push('/')}>
                        <HomeIcon style={{marginRight: 12, fontSize: 30, color: "white" }} />
                        <Typography variant="h6" color="inherit">
                            Token Analyst
                    </Typography>
                    </div>

                </Toolbar>
            </AppBar>
            <Route exact path="/" component={App} />
            <Route path="/token-details/:token" component={TokenDetails} />
        </Router>
    </Provider>,
    document.getElementById('root')
);


