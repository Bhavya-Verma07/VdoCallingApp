import { useState } from 'react'
import './App.css';
import VideoRoom from './Component/videoRoom';


function App() {
  const [joined, setJoined] = useState(false)

  return (
    <div className="App">
      <h1 style={{color: 'darkblue'}}>Virtual call</h1>
      {!joined && ( 
      <button style={{backgroundColor:"greenyellow"}} onClick={()=>setJoined(true) }>Join room</button>
      )}
      { joined && (
       <VideoRoom/>
      )}
    </div>
  );
}

export default App;
