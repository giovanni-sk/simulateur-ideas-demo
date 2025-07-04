import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { TaxProvider } from './context/TaxContext';
import Home from './pages/Home';
import Revenue from './pages/Revenue';
import Results from './pages/Results';
import Chat from './pages/Chat';

function App() {
  return (
    <TaxProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/revenue" element={<Revenue />} />
          <Route path="/results" element={<Results />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </TaxProvider>
  );
}

export default App;