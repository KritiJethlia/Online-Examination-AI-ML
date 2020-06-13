import React, { Component } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import history from './history';
import welcome from './Welcome';
import Input from './input.js';
import QInput from './QuestionInput';

export default class Routes extends Component {
    render(){
        return (
            <Router history={history}>
                <Switch>
                    <Route exact path ='/' component={welcome} />
                    <Route path='/test' component={Input}/>
                    <Route path='/setquestion' component={QInput}/>
                </Switch>
            </Router>
        )
    }
}