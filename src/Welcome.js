// Landing page
import React ,{Component} from "react";
import Recorder from './Recorder';
export default class welcome extends Component{
    render(){
        return(
            <div>
            <h1> Welcome!!</h1>
            <Recorder/>
            </div>
        )
    }
} 