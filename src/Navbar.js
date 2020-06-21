import React ,{Component} from "react";
import history from './history.js';

export default class Navbar extends Component{
    render(){
        return (
            <div>
                <nav class="navbar navbar-expand-lg navbar-light bg-info">
            <h3>Tester   </h3>
            <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>

            <div class="collapse navbar-collapse" id="navbarSupportedContent">
                <ul class="navbar-nav mr-auto">
                <li class="nav-item active">
                    <a class="nav-link ml-3" href="/">Home <span class="sr-only">(current)</span></a>
                </li>
                <li class="nav-item">
                    <a class="nav-link ml-3 text-body" href="" onClick={()=>history.push('/setquestion')}>Set the Questions</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link ml-3 text-body" href="" onClick={()=>history.push('/result')} >Start a test</a>
                </li>
                </ul>
            </div>
            </nav>
            </div>
        )
    }
}