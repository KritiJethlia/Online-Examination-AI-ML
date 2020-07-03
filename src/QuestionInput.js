// Used by the Examiner to input Questions
import React,{Component} from 'react';
import axios from 'axios';
import './Qinput.css';

export default class QInput extends Component{
    constructor()
    {
        super();
        this.state={
            keywords:[],
            keysentences:[],
            question:'',
            currkey:'',
            currsent:'',
            syn:'',
        }

    }
    
    // append in Keyword array
    appendKey=()=>
    {
        this.setState({
            keywords :[...this.state.keywords,this.state.currkey], currkey:"",
        })
    }

    // append in sentence array
    appendSent=()=>
    {
        this.setState({
            keysentences :[...this.state.keysentences,this.state.currsent], currsent:"",
        })
    }

    // Removing from key word array
    removeKey(value) {
        var array = [...this.state.keywords]; // make a separate copy of the array
        if (value !== -1) {
          array.splice(value, 1);
          this.setState({keywords: array});
        }
      }

    // remove from key sentences array
    removeSent(value) {
        var array = [...this.state.keysentences]; // make a separate copy of the array
        if (value !== -1) {
          array.splice(value, 1);
          this.setState({keysentences: array});
        }
      }

    //   change parameter as input changes
    onInputChange=(e)=>{
        this.setState({[e.target.name]:e.target.value});
      }

    //   send response over to the backend
    onSubmit=()=>{
        this.setState({
            keywords :[...this.state.keywords,this.state.currkey],
            keysentences :[...this.state.keysentences,this.state.currsent],
        },()=>{
        var temp1= this.state.keywords.filter(i=> i!=='');
        var temp2= this.state.keysentences.filter(i=> i!=='')
        this.setState({
            keywords: temp1,
            keysentences: temp2,
        },()=>{
            if(this.state.question === '' || this.state.keywords===[] || this.state.keysentences===[])
                alert("Field can't be empty");
            else
            {
                this.setState({keywords :[...this.state.keywords,Number(this.state.syn)]},()=>{
                axios.post('http://localhost:5000/enterQuestions',{question:this.state.question,keyw :this.state.keywords,keysent :this.state.keysentences })
                .then(alert("Added to the database"))
                .then(this.setState(
                    {
                        question:'',
                        keywords:[],
                        keysentences:[],
                        currkey:'',
                        currsent:'',
                        syn:''
                    }
                ))
                })
            }
        })
     }
    )
    }
    render()
    {
        return(
            <div > 
                <center>
                <div class="card qcard" style={{width: 1300 }}>
                <div class="card-body">
                    <br></br>
                    <h3 class="card-title">Instructions For Setting Questions:</h3>
                <ol class="text-left instruction">
                <li> Enter the question in the given space along with the keywords and key sentences expected in the answer.</li>
                <li>While entering the Keywords remember not to leave spaces behind it.</li>
                <li>Split hyphenated words into two words example carbon,dioxide. Alternatively you can include them in sentences part.</li>
                <li>Also enter the number of synonyms in the key words</li>
                <li>Key sentences should be short and without any punctuations.</li>
                </ol>
                </div>
                <br></br>
                <div class="form-group col-15" style={{margin: "15px"}}>
                    <textarea name='question' rows="2" cols="100" class="form-control" value={this.state.question} placeholder="Type a Question." onChange={this.onInputChange} value={this.state.question} >{this.state.question}</textarea>
                    <br></br>
                    <form role="form" autoComplete="off" className="form-row">
                        <div className="col-4">
                        <div className="entry input-group d-flex align-items-center mb-1 ">  
                        <input className="form-control" name="currkey"onChange={this.onInputChange} value={this.state.currkey}   type="text" placeholder="Enter Keywords" />
                        <span className="input-group-btn">
                        <button className="btn btn-success btn-add m-1 plusButton" type="button" onClick={this.appendKey}>
                        <span className="glyphicon glyphicon-plus">+</span>
                        </button>
                        </span>
                        </div>
                        {
                            this.state.keywords.map((value,index)=>{
                                return(
                                <div key={index} style={{height:"45.6"}}>
                                <div className="entry input-group d-flex align-items-center mb-1" >
                                <textarea className="form-control urlfield" name="fields[]" rows="1" type="text" key={index} disabled>{value}</textarea>        
                                <span className="input-group-btn">
                                <button className="btn btn-danger btn-add m-1 plusButton" type="button" style={{width :"34.61px"}} onClick={()=>{this.removeKey(index)}}>
                                <span className="glyphicon glyphicon-minus">-</span>
                                </button>
                                </span>
                                </div>
                                </div>
                                );
                                })
                        }
                        </div>
                        <div className="col-17">
                        <input className="form-control mt-1" name="syn"onChange={this.onInputChange} value={this.state.syn}   type="text" placeholder="Number of Synonyms" />
                        </div>
                        <div className="col">
                        <div className="entry input-group d-flex align-items-center mb-1 col ">  
                        <input className="form-control " name="currsent" onChange={this.onInputChange} value={this.state.currsent}   type="text" placeholder="Enter Key Sentences" />
                        <span className="input-group-btn">
                        <button className="btn btn-success btn-add m-1 plusButton" type="button" onClick={this.appendSent}>
                        <span className="glyphicon glyphicon-plus">+</span>
                        </button>
                        </span>
                        </div>
                        {
                            this.state.keysentences.map((value,index)=>{
                                return(
                                <div key={index} style={{height:"45.6"}}>
                                <div className="entry input-group d-flex align-items-center mb-1">
                                <textarea className="form-control urlfield " name="fields[]" rows="1" type="text"  key={index} disabled>{value}</textarea>        
                                <span className="input-group-btn">
                                <button className="btn btn-danger btn-add m-1 plusButton" type="button" style={{width :"34.61px"}} onClick={()=>{this.removeSent(index)}}>
                                <span className="glyphicon glyphicon-minus">-</span>
                                </button>
                                </span>
                                </div>
                                </div>
                                );
                                })
                        }
                        </div>
                    </form>
                    <br></br>
                    <button type="button" className="btn btn-primary" onClick={this.onSubmit}>Submit</button>
            </div>
            </div>
            </center>
            </div>
        )
        
    }
}