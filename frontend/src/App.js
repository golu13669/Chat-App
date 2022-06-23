import {Routes,Route} from "react-router-dom";
import Chatpage from "./Pages/Chatpage";
import Homepage from "./Pages/Homepage";
import "./App.css";
import Forgetpass from "./Components/Forgetpass/forgetpass";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Homepage/>} />
        <Route path="/chats" element={<Chatpage/>}/>
        <Route path="/api/user/reset/:id/:token" element={<Forgetpass/>}/>
      </Routes>
    </div>
  );
}

export default App;
