import { useState } from 'react'
import './App.css';
import VideoRoom from './Component/videoRoom';


function App() {
  const [joined, setJoined] = useState(false)

  return (
    <div className="App">
      <h1>Virtual call</h1>
      {!joined && (
      <button onClick={()=>setJoined(true)}>Join room</button>
      )}
      { joined && (
       <VideoRoom/>
      )}
    </div>
  );
}

export default App;
