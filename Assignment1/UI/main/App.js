import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Pages
import Home from './landing/Home/Home';
import Upload from './landing/Upload/Upload';
import Video from './landing/Video/Video';
import Reformat from './landing/Reformat/Reformat'; // Updated import

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/upload" element={<Upload />} />
        <Route path="/videos" element={<Video />} />
        <Route path="/reformat/:id" element={<Reformat />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;