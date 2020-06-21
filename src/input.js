import React from 'react';
import axios from 'axios';
import {questions} from './data/constants.js';
import Clock from './Clock';
import history from './history.js';
 
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
     onChangeInput=(e,index)=>{
        this.ans[index] =e.target.value;
        window.localStorage.setItem('answer',JSON.stringify(this.ans) );
        window.localStorage.setItem('qorder',JSON.stringify(this.qid) );
     }
     onSubmit=(e)=>{
        this.setState({
            once:1
        })
         //console.log('submitting...')
        axios.post('http://localhost:5000/ans', {ans: window.localStorage.getItem('answer') ,ques :window.localStorage.getItem('qorder'),user:window.localStorage.getItem('name')})
    .then(response => {
      //console.log(response)
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
                 <Clock time={this.state.count}/>
                 <br></br>
                 <br></br>
            {
                this.state.q.map((quest ,index)=>{
                    return(
                        <div>
                       
                        <h3>Q{index+1} : {quest}</h3>
                        {/* {
                            
                            this.ans[index]=" "
                        } */}
                        <textarea name="second" rows="5" cols="100" title="Answer" onChange={(e)=>this.onChangeInput(e,index)} ></textarea>
                        <br></br>
                        <br></br>
                        </div>
                    );
                })
            }
             
             <br></br>
             <button type="button" className="btn btn-primary" onClick={this.onSubmit}>Submit</button>
             </div>
         );
     }
 }
 export default Input;