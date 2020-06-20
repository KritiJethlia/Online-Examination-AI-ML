import React,{Component} from 'react';
import axios from 'axios';

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

    appendKey=()=>
    {
        this.setState({
            keywords :[...this.state.keywords,this.state.currkey], currkey:"",
        })
    }
    appendSent=()=>
    {
        this.setState({
            keysentences :[...this.state.keysentences,this.state.currsent], currsent:"",
        })
    }
    removeKey(value) {
        var array = [...this.state.keywords]; // make a separate copy of the array
        if (value !== -1) {
          array.splice(value, 1);
          this.setState({keywords: array});
        }
      }
    removeSent(value) {
        var array = [...this.state.keysentences]; // make a separate copy of the array
        if (value !== -1) {
          array.splice(value, 1);
          this.setState({keysentences: array});
        }
      }
    onInputChange=(e)=>{
        this.setState({[e.target.name]:e.target.value});
      }
    onSubmit=()=>{
        this.setState({
            keywords :[...this.state.keywords,this.state.currkey],
            keysentences :[...this.state.keysentences,this.state.currsent],
        },()=>{
        this.setState({keywords :[...this.state.keywords,Number(this.state.syn)]},()=>{
        var temp1= this.state.keywords.filter(i=> i!=='');
        var temp2= this.state.keysentences.filter(i=> i!=='')
        this.setState({
            keywords: temp1,
            keysentences: temp2,
        },()=>{
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
    })
    })
    }
    render()
    {
        return(
            <div > 
            <div>
                <h3>
                Instructions For Setting Questions:
                </h3>
                <h4> Enter the question in the given space along with the keywords and key sentences expected in the answer.</h4>
                <h4>While entering the Keywords remember not to leave spaces behind it.</h4>
                <h4>Split hyphenated words into two words example carbon,dioxide. Alternatively you can include them in sentences part.</h4>
                <h4>Also enter the number of synonyms in the key words</h4>
                <h4>Key sentences should be short and without any punctuations.</h4>
                <br></br>
                <div class="form-group col-15" style={{padding: "20px",margin: "50px"}}>
                    <label for="exampleFormControlTextarea1">Enter Question:</label>
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
                                <div key={index}>
                                <div className="entry input-group d-flex align-items-center mb-1">
                                <textarea className="form-control urlfield" name="fields[]" rows="1" type="text" key={index} disabled>{value}</textarea>        
                                <span className="input-group-btn">
                                <button className="btn btn-danger btn-add m-1 plusButton" type="button"  onClick={()=>{this.removeKey(index)}}>
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
                        <input className="form-control" name="syn"onChange={this.onInputChange} value={this.state.syn}   type="text" placeholder="Number of Synonyms" />
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
                                <div key={index}>
                                <div className="entry input-group d-flex align-items-center mb-1">
                                <textarea className="form-control urlfield " name="fields[]" rows="1" type="text" key={index} disabled>{value}</textarea>        
                                <span className="input-group-btn">
                                <button className="btn btn-danger btn-add m-1 plusButton" type="button"  onClick={()=>{this.removeSent(index)}}>
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
            </div>
        )
        
    }
}