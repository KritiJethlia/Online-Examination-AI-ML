// before the timer starts take user name as input
import React from 'react';
import history from './history.js';

export default class TestInstruc extends React.Component{
    constructor()
    {
        super();
        this.state ={
            name:''
        }
    }

    onInputChange=(e)=>{
        this.setState({
            name:e.target.value
        });
    }
    render()
    {
        return(
            <div>
                <h3>Instructions for giving the Examination</h3>
                <div>
                    <ul>
                        <li>There are three questions in the test</li>
                        <li>You have 10 minutes to answer all the questions</li>
                        <li>After 10 minutes the answers get submitted automatically</li>
                    </ul>
                </div>
                <center>
                <h4>All the Best!</h4>
                <input className="form-control m-3" style={{width:200}} name="name" onChange={this.onInputChange} value={this.state.name}   type="text" placeholder="Name" />
                </center>
                <button type="button" className="btn btn-primary" 
                onClick={()=>{
                    if(this.state.name=='')
                        alert("Name field can't be empty")
                    else{
                    history.push('./test');
                    localStorage.setItem('name',this.state.name)
                     }
                }}
                 >Start</button>
            </div>
        );
    }
}