import React, { useState } from 'react'
import axios from 'axios';

// Suggested initial states
const initialMessage = ''
const initialEmail = ''
const initialSteps = 0
const initialIndex = 4 // the index the "B" is at
const URL = "http://localhost:9000/api/result";

export default function AppFunctional(props) {
  // THE FOLLOWING HELPERS ARE JUST RECOMMENDATIONS.
  // You can delete them and build your own logic from scratch.

  const [message, setMessage] = useState(initialMessage);
  const [email, setEmail] = useState(initialEmail);
  const [steps, setSteps] = useState(initialSteps);
  const [index, setIndex] = useState(initialIndex);


  function getXY() {
    // It it not necessary to have a state to track the coordinates.
    // It's enough to know what index the "B" is at, to be able to calculate them.
    let arr = [
      [1, 1], [2, 1], [3, 1],
      [1, 2], [2, 2], [3, 2],
      [1, 3], [2, 3], [3, 3]
    ]
    return arr[index];
  }

  function getXYMessage() {
    // It it not necessary to have a state to track the "Coordinates (2, 2)" message for the user.
    // You can use the `getXY` helper above to obtain the coordinates, and then `getXYMessage`
    // returns the fully constructed string. 
    let cor = getXY(index)
    return(`Coordinates (${cor[0]}, ${cor[1]})`);
  }

  function reset() {
    // Use this helper to reset all states to their initial values.
    setIndex(initialIndex)
    setSteps(initialSteps)
    setMessage(initialMessage)
    setEmail(initialEmail)
  }

  function getNextIndex(direction) {
    // This helper takes a direction ("left", "up", etc) and calculates what the next index
    // of the "B" would be. If the move is impossible because we are at the edge of the grid,
    // this helper should return the current index unchanged.
    let tempInd = index;

    if (direction === "left") {
      tempInd--;
      if(tempInd === 2 || tempInd === 5) {
        tempInd = -1;
      }
    }
    else if (direction === "right") {
      tempInd++;
      if(tempInd === 3 || tempInd === 6) {
        tempInd = -1;
      }
    }
    else if (direction === "up") {
      tempInd -= 3
    }
    else {
      tempInd += 3
    }

    if (tempInd > 8 || tempInd < 0 ) {
      setMessage(`You can't go ${direction}`)
      return index;
    }
    setMessage("");
    setSteps(steps+1);
    return tempInd;
  }

  function move(evt) {
    // This event handler can use the helper above to obtain a new index for the "B",
    // and change any states accordingly.
    setIndex(getNextIndex(evt));
  }

  function onChange(evt) {
    // You will need this to update the value of the input.
    setEmail(evt.target.value);

  }

  function onSubmit(evt) {
    // Use a POST request to send a payload to the server.
    evt.preventDefault()
    let xy = getXY()
    let values = {x:xy[0], y:xy[1], steps:steps, email:email};
    axios.post(URL, values)
      .then(res => {
        setEmail(initialEmail)
        setMessage(res.data.message);
      })
      .catch(err => {
        setMessage(err.response.data.message);
      })
  }

  return (
    <div id="wrapper" className={props.className}>
      <div className="info">
        <h3 id="coordinates">{getXYMessage()}</h3>
        <h3 id="steps">{`You moved ${steps} time${steps !== 1 ? "s" : ""}`}</h3>
      </div>
      <div id="grid">
        {
          [0, 1, 2, 3, 4, 5, 6, 7, 8].map(idx => (
            <div key={idx} className={`square${idx === index ? ' active' : ''}`}>
              {idx === index ? 'B' : null}
            </div>
          ))
        }
      </div>
      <div className="info">
        <h3 id="message">{message}</h3>
      </div>
      <div id="keypad">
        <button id="left" onClick={() => move("left")}>LEFT</button>
        <button id="up" onClick={() => move("up")}>UP</button>
        <button id="right" onClick={() => move("right")}>RIGHT</button>
        <button id="down" onClick={() => move("down")}>DOWN</button>
        <button id="reset" onClick={() => reset()}>reset</button>
      </div>
      <form onSubmit={onSubmit}>
        <input id="email" type="email" placeholder="type email" onChange={onChange} value={email}></input>
        <input id="submit" type="submit"></input>
      </form>
    </div>
  )
}
