import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import LiveMutualFundsAnalysis from './pages/LiveMutualFundsAnalysis/LiveMutualFundsAnalysis'; // Update the path as necessary
import HRA from './pages/HRA/HRA';
import PPF from './pages/PPF/PPF';
import Header from './components/Header/Header';

const App = () => (
  <>
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/live-mutual-funds-analysis"
          element={<LiveMutualFundsAnalysis />}
        />
        <Route path="/hra-exemption" element={<HRA />} />
        <Route path="/ppf-calculator" element={<PPF />} />
      </Routes>
    </Router>
  </>
);
export default App;
