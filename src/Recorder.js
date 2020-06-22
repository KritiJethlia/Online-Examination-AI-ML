import React from 'react';
import MediaCapturer from 'react-multimedia-capture';
import ReactPlayer from 'react-player'

export default class Recorder extends React.Component{
    constructor() {
		super();
		this.state = {
			granted: false,
			rejectedReason: '',
			recording: false,
			paused: false
        };
    }
    handleRequest=()=> {
		console.log('Request Recording...');
	}
	handleGranted=()=> {
		this.setState({ granted: true });
		console.log('Permission Granted!');
	}
	handleDenied=(err) =>{
		this.setState({ rejectedReason: err.name });
		console.log('Permission Denied!', err);
	}
	handleStart=(stream)=> {
		this.setState({
			recording: true
		});

		this.setStreamToVideo(stream);
		console.log('Recording Started.');
	}
	handleStop=(blob) =>{
		this.setState({
			recording: false
		});

		this.releaseStreamFromVideo();

        console.log('Recording Stopped.');
		this.downloadVideo(blob);
	}
	handleError=(err)=> {
		console.log(err);
	}
	handleStreamClose=()=> {
		this.setState({
			granted: false
		});
	}
	setStreamToVideo=(stream) =>{
		let video = this.refs.app.querySelector('video');
		
		if(window.URL) {
			video.srcObject = stream
		}
		else {
			video.src = stream;
		}
	}
	releaseStreamFromVideo=() =>{
		this.refs.app.querySelector('video').src = '';
	}
	downloadVideo=(blob)=> {
		let url = URL.createObjectURL(blob);
		let a = document.createElement('a');
		a.style.display = 'none';
		a.href = url;
		a.target = '_blank';
		document.body.appendChild(a);
        a.click();
        console.log(blob)
        var csvURL = url
        // tempLink = document.createElement('a');
        // tempLink.href = csvURL;
        // tempLink.setAttribute('download', 'filename.csv');
        // tempLink.click();
        return <ReactPlayer url={url} playing />
        
	}
    render(){
        const granted = this.state.granted;
		const rejectedReason = this.state.rejectedReason;
		const recording = this.state.recording;
		const paused = this.state.paused;

        return(
            <div ref="app">
            <MediaCapturer
                    constraints={{ audio: false, video: true }}
                    timeSlice={10}
                    onGranted={this.handleGranted}
                    onDenied={this.handleDenied}
                    onStart={this.handleStart}
                    onStop={this.handleStop}
                    onError={this.handleError}
                    onStreamClosed={this.handleStreamClose}
                    render={({ request, start, stop, pause, resume }) => 
                    <div>
                        <p>Granted: {granted.toString()}</p>
                        <p>Rejected Reason: {rejectedReason}</p>
                        <p>Recording: {recording.toString()}</p>

 
                        {!granted && <button onClick={request}>Get Permission</button>}
                        <button onClick={start}>Start</button>
                        <button onClick={stop}>Stop</button>
                        
                        <p>Streaming test</p>
                        <div >
                        <video autoPlay style={{height:200,width:200}} ></video>
                        </div>
                        </div>
                    }/>
                    </div>
        )
    }
}