import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import "./App.css";
import LoginPage from "./components/loginpage";
import SignUpPage from "./components/signuppage";
import OTPPage from './components/otppage';
import Homepage from './components/homepage';
import BankProfile from './components/bankprofile';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/otp" element={<OTPPage />} />
        <Route path="/homepage" element={<Homepage />} />
        <Route path="/profile" element={<BankProfile />} />
      </Routes>
    </Router>
  );
}

export default App;
