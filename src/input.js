import React from 'react';
import axios from 'axios';
import {questions} from './data/constants.js'
 
 class Input extends React.Component{
     constructor(props){
         super(props);
         this.state ={
             q:[],
             id:[],
             a:[],
         }
         this.ques =[];
         this.ans =[];
         this.qid=[];
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
     }
     onChangeInput=(e,index)=>{
         this.ans[index] =e.target.value;
        window.localStorage.setItem('answer',JSON.stringify(this.ans) );
        window.localStorage.setItem('qorder',JSON.stringify(this.qid) );
     }
     onSubmit=(e)=>{
         console.log('submitting...')
        axios.post('http://localhost:5000/ans', {ans: window.localStorage.getItem('answer') ,ques :window.localStorage.getItem('qorder')})
    .then(response => {
      console.log('Registered')
    })
     }
     render()
     {
         return(
             <div>
            {
                this.state.q.map((quest ,index)=>{
                    return(
                        <div>
                       
                        <h3>Q{index+1} : {quest}</h3>
                        {
                            
                            this.ans[index]=" "
                        }
                        <textarea name="second" rows="5" cols="100" title="Answer" onChange={(e)=>this.onChangeInput(e,index)} ></textarea>
                        <br></br>
                        <br></br>
                        </div>
                    );
                })
            }
             
             <br></br>
             <button class="primary" onClick={this.onSubmit}>Submit</button>
             </div>
         );
     }
 }
 export default Input;