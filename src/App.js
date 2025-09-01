
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MainScreen from './MainScreen.js';
import AddTasks from './AddTasks.js';
import DisplayTasks from './DisplayTasks.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainScreen />} />
        <Route path="/addtask" element={<AddTasks />} />
        <Route path="/displaytask" element={<DisplayTasks />} />
        <Route path="*" element={<div style={{ padding: 16 }}>Not found</div>} />
      </Routes>
    </Router>
  );

};

export default App;