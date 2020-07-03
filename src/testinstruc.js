// before the timer starts take user name as input
import React from 'react';
import history from './history.js';
import './testinstruction.css';

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
                <center>
                <div class="card qcard" style={{width: 900 }}>
                <div class="card-body">
                    <br></br>
                <h3>Instructions for giving the Examination</h3>
                <br></br>
                <div>
                    <ol class="text-left txt" style={{marginLeft:"50px"}}>
                        <li>There are three questions in the test</li>
                        <li>You have 10 minutes to answer all the questions</li>
                        <li>After 10 minutes the answers get submitted automatically</li>
                        <li>Candidates are supposed to keep the webcam on during the examination</li>
                    </ol>
                </div>
                <br></br>
                <h4>All the Best!</h4>
                
                <br></br>
                <center>
                
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
            </div>
            </center>
            </div>
        );
    }
}