import React, { Component } from "react";
import { Router, Switch, Route, Redirect } from "react-router-dom";
import history from './history';
import welcome from './Welcome';
import Input from './input.js';
import QInput from './QuestionInput';
import TestInstruc from './testinstruc';
import Result from './Result';

export default class Routes extends Component {
    render(){
        return (
            <Router history={history}>
                <Switch>
                    <Route exact path ='/' component={welcome} />
                    <Route path='/Instruction' component={TestInstruc}/>
                    <Route path='/test' component={Input}/>
                    <Route path='/setquestion' component={QInput}/>
                    <Route path='/result' component={Result}/>
                </Switch>
            </Router>
        )
    }
}