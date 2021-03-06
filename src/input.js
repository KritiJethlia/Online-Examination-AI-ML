import React from 'react';
import axios from 'axios';
import {questions} from './data/constants.js';
import Clock from './Clock';
import history from './history.js';
import Recorder from './Recorder.js';
import './input.css';
 
 class Input extends React.Component{
     constructor(props){
         super(props);
         this.state ={
             q:[],
             id:[],
             a:[],
             count: 600,
             once:0,
         }
         this.ques =[];
         this.ans =["","",""];
         this.qid=[];
     }

    //  Starts the timer
     handleStart() {
        this.timer = setInterval(() => {
          const newCount = this.state.count - 1;
          if(newCount===0 && this.state.once===0)
          {
            this.onSubmit();
            this.setState({
                once:1
            })
          }
          else
          this.setState(
            {count: newCount >= 0 ? newCount : 0}
          );
        }, 1000)
      } 

      componentDidMount(){
         axios.get('http://localhost:5000/getQuestions')
         .then(response =>{
             response.data.map((query,index)=>{
                 this.qid[index]=query.id;
                 this.ques[index]=query.quest;
             })
             this.setState({q:this.ques, id: this.qid})
         })
          this.handleStart();
      }

    //  changing the input values
     onChangeInput=(e,index)=>{
        this.ans[index] =e.target.value;
        window.localStorage.setItem('answer',JSON.stringify(this.ans) );
        window.localStorage.setItem('qorder',JSON.stringify(this.qid) );
     }

    //Send response to backend when submitted  
     onSubmit=(e)=>{
        this.setState({
            once:1
        })
        axios.post('http://localhost:5000/ans', {ans: window.localStorage.getItem('answer') ,ques :window.localStorage.getItem('qorder'),user:window.localStorage.getItem('name')})
    .then(response => {
      window.localStorage.setItem('marks',JSON.stringify(response.data[0]))
      window.localStorage.setItem('intplag',JSON.stringify(response.data[1]))
      window.localStorage.setItem('onlineplag',JSON.stringify(response.data[2]))
      history.push('/result');
    })
     }
     render()
     {
         return(
             <div>
                 <div className="d-flex justify-content-center">
                 <div className="card quest mr-5">
                
                 <div className="mt-5">
            {
                this.state.q.map((quest ,index)=>{
                    return(
                        <div>
                       
                        <h3>Q{index+1} : {quest}</h3>
                        
                        <textarea name="second" rows="5" cols="100" title="Answer" onChange={(e)=>this.onChangeInput(e,index)} ></textarea>
                        <br></br>
                        <br></br>
                        </div>
                    );
                })
            }
            </div>
             </div>
             <div>
             <Clock time={this.state.count}/>
             <div className ="card qpallate mt-3" style={{width:200  }}>
                <div className="mt-3 ml-3 d-flex justify-content-around">
                    <button type="button" className="qbutton mr-3">1</button>
                    <button type="button" className="qbutton mr-3">2</button>
                    <button type="button" className="qbutton mr-3">3</button>
                </div>
             </div>
             <button type="button" className="btn btn-primary mt-3 submit" style={{width:200  }} onClick={this.onSubmit}>Submit</button>
             </div>
             </div>
             </div>
         );
     }
 }
 export default Input;