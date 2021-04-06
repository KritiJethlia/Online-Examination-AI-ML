// displays Results of the candidate
import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

export default class Result extends React.Component{
    constructor()
    {
        super();
        this.grades=JSON.parse(window.localStorage.getItem('marks'));
        this.intplag=JSON.parse(window.localStorage.getItem('intplag'));
        this.onlineplag=JSON.parse(window.localStorage.getItem('onlineplag'));
    }
    componentDidMount(){
        window.history.pushState(null, document.title, window.location.href);
        window.addEventListener('popstate', function (event){
        window.history.pushState(null, document.title,  window.location.href);
    });
    }
    render(){
        return(
            <div>
                <h3>Your Results are:</h3>
                <br></br><br></br>
                <h3 class="text-monospace text-info">Marks</h3>
                <div class="d-flex justify-content-around mt-3 " style={{height:270}}>

                    <div style={{width:150 ,height:150}} >
                    <h5>Question 1</h5>
                    <br></br>
                    <CircularProgressbar value={this.grades[0]*5} maxValue={5} text={`${this.grades[0]*5}`+'/5'}  /> 
                    </div>

                    <div style={{width:150 ,height:150}}>
                    <h5>Question 2</h5>
                    <br></br>
                    <CircularProgressbar value={this.grades[1]*5} maxValue={5} text={`${this.grades[1]*5}`+'/5'}  /> 
                    </div>

                    <div style={{width:150 ,height:150}}>
                    <h5>Question 3</h5>
                    <br></br>
                    <CircularProgressbar value={this.grades[2]*5} maxValue={5} text={`${this.grades[2]*5}`+'/5'}  /> 
                    </div>
                </div>

                <h3 className="mt-5 text-monospace text-info">Internal Plagiarism</h3>
                <div class="d-flex justify-content-around mt-3 " style={{height:270}}>
                   
                    <div style={{width:150 ,height:150}} >
                    <h5>Question 1</h5>
                    <br></br>
                    <CircularProgressbar value={Math.floor(this.intplag[0])} maxValue={100} text={`${Math.floor(this.intplag[0])}`+'%'}  /> 
                    </div>

                    <div style={{width:150 ,height:150}}>
                    <h5>Question 2</h5>
                    <br></br>
                    <CircularProgressbar value={Math.floor(this.intplag[1])} maxValue={100} text={`${Math.floor(this.intplag[1])}`+'%'}  /> 
                    </div>

                    <div style={{width:150 ,height:150}}>
                    <h5>Question 3</h5>
                    <br></br>
                    <CircularProgressbar value={Math.floor(this.intplag[2])} maxValue={100} text={`${Math.floor(this.intplag[2])}`+'%'}  /> 
                    </div>
                </div>

                <h3 className="mt-5 text-monospace text-info">Online Plagiarism</h3>
                <div class="d-flex justify-content-around mt-3" style={{height:270}}>
                   
                    <div style={{width:150 ,height:150}} >
                    <h5>Question 1</h5>
                    <br></br>
                    <CircularProgressbar value={Math.floor(this.onlineplag[0])} maxValue={100} text={`${Math.floor(this.onlineplag[0])}`+'%'}  /> 
                    </div>

                    <div style={{width:150 ,height:150}}>
                    <h5>Question 2</h5>
                    <br></br>
                    <CircularProgressbar value={Math.floor(this.onlineplag[1])} maxValue={100} text={`${Math.floor(this.onlineplag[1])}`+'%'}  /> 
                    </div>

                    <div style={{width:150 ,height:150}}>
                    <h5>Question 3</h5>
                    <br></br>
                    <CircularProgressbar value={Math.floor(this.onlineplag[2])} maxValue={100} text={`${Math.floor(this.onlineplag[2])}`+'%'}  /> 
                    </div>
                </div>
            </div>
        )
    }
}
