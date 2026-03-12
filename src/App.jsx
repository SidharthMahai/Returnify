import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Box, useColorModeValue } from '@chakra-ui/react';
import Home from './pages/Home/Home';
import LiveMutualFundsAnalysis from './pages/LiveMutualFundsAnalysis/LiveMutualFundsAnalysis';
import PPF from './pages/PPF/PPF';
import About from './pages/About/About';
import Header from './components/Header/Header';
import './App.css';

const App = () => {
  const appBg = useColorModeValue(
    'radial-gradient(circle at top left, rgba(24, 145, 255, 0.22), transparent 32%), radial-gradient(circle at 85% 15%, rgba(45, 212, 191, 0.18), transparent 22%), linear-gradient(180deg, #f8fbff 0%, #eef4ff 48%, #fdfefe 100%)',
    'radial-gradient(circle at top left, rgba(24, 145, 255, 0.2), transparent 28%), radial-gradient(circle at 88% 18%, rgba(45, 212, 191, 0.12), transparent 20%), linear-gradient(180deg, #08111f 0%, #0c1729 52%, #07101d 100%)'
  );

  return (
    <Router>
      <Box minH="100vh" bg={appBg}>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route
          path="/live-mutual-funds-analysis"
          element={<LiveMutualFundsAnalysis />}
        />
        <Route path="/ppf-calculator" element={<PPF />} />
        <Route path="/about" element={<About />} />
      </Routes>
      </Box>
    </Router>
  );
};
export default App;
