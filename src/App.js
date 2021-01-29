import React from 'react';
import { useState, useEffect } from "react";
import './App.css';

import {
  CircularProgressbar,
  buildStyles
} from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

import {ReactComponent as Crown} from "./assets/crown.svg"
import {ReactComponent as Pushup} from "./assets/pushup.svg"

import useSound from 'use-sound';

import pingSfx from "./assets/ping.mp3"
import completeSfx from "./assets/complete.mp3"


function App() {

  const [ping] = useSound(pingSfx);
  const [complete] = useSound(completeSfx);

  const [currentPushups, setCurrentPushups] = useState(0);
  const [maxPushups, setMaxPushups] = useState(localStorage.getItem('maxPushups') ? localStorage.getItem('maxPushups'): 0);
  const [isComplete, setIsComplete] = useState(1);
  const [pushupTimeRemaining, setPushupTimeRemaining] = useState(0)
  const [visualTimer, setVisualTimer] = useState(0)
  const [timePercentage, setTimePercentage] = useState(0)
  const [newRecord, setNewRecord] = useState(0)

  

  function tap(event){
    ping()
    console.log(isComplete)
    if(isComplete <= 0){
      setPushupTimeRemaining(50);
      setCurrentPushups(currentPushups + 1)
    }else{
      setPushupTimeRemaining(50);
      setCurrentPushups(1)
      setIsComplete(0)
      setNewRecord(0)
      console.log(newRecord)
    }
  }

  function subtractSecond(){
    setPushupTimeRemaining(pushupTimeRemaining - 1)
  }

  useEffect( ()=>{
    if (currentPushups > maxPushups){
     
      
      setMaxPushups(currentPushups)
      localStorage.setItem('maxPushups', currentPushups);
      setNewRecord(1)
      
    }
  },[currentPushups])

  useEffect( ()=>{
    clearTimeout(visualTimer)
    console.log("Done")
    console.log("isComplete: "+ isComplete)
    
    setNewRecord(0)

    if ((currentPushups >= maxPushups) && (currentPushups > 1)){
      complete()
    }

    
  },[isComplete])

  useEffect( ()=>{

    clearTimeout(visualTimer)

    if (pushupTimeRemaining > 0){
      setVisualTimer(setTimeout(subtractSecond, 100));
      
    }else{
      setIsComplete(1)
    }
    setTimePercentage((pushupTimeRemaining/50).toFixed(2)*100 )
    
  },[pushupTimeRemaining])


  

  return (
    <div className="App" onClick={tap} style={{height: "100vh"}}>


      <div style={{margin: "5%"}}>
        <Crown id="left" className="box" style={{height: "6rem", verticalAlign: "middle"}}/>
        <h1 id="right" className="box" style={{height: "3rem", verticalAlign: "middle", color: ((currentPushups>=maxPushups)&&(currentPushups>0)) ? "firebrick" : "black"}} >{maxPushups}</h1>
      </div>

      <div>
        <Pushup id="left" className="box" style={{height: "6rem", verticalAlign: "middle"}}/>
        <h1 id="right" className="box" style={{height: "3rem", verticalAlign: "middle", color: ((currentPushups>=maxPushups)&&(currentPushups>0)) ? "firebrick" : "black"}} >{currentPushups}</h1>
      </div>
        
      <div className="outer">
        
      </div>

      <div className="background">
        
        <CircularProgressbar
          value={ timePercentage }
          strokeWidth={50}
          styles={buildStyles({
            strokeLinecap: "butt",
            pathTransition:
                timePercentage > 99 ? "none" : "stroke-dashoffset 0.3s ease 0s"
          })}
      />

      </div>
      <p style={{margin: "5%", fontSize: "20px", visibility: isComplete ? 'visible':'hidden'}}>
        Get into push-up position and place device on the floor infront of your face. On your decent, tap the screen with your nose to start the count. You must complete each push-up within 5 seconds of each other.
      </p>
    </div>
  );
}

export default App;
