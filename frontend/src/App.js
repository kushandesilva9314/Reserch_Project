import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import Login from './Pages/login';
import Home from './Pages/home';
import Admin from './Pages/admin';
import First from './Pages/start';
import U_Reg from './Pages/u_reg';
import C_Reg from './Pages/c_reg';
import I_Admin from './Pages/a_inv';
import CPY_Admin from './Pages/a_company';
import ChatBot from './Pages/chatbot';
import CON_Admin from './Pages/a_content';
import About from './Pages/about';
import News from './Pages/news';
import Profile from './Pages/profile';
import Company from './Pages/company';
import Com_Man from './Pages/profile_management';
import Ads_Man from './Pages/ads_management';
import Ads from './Pages/ads';
import Sales from './Pages/sales_management';
import Forgot_Pass from './Pages/ForgotPassword';
function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/start" element={<First />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<Admin />} />
          <Route path="/user-registration" element={<U_Reg />} />
          <Route path="/company-registration" element={<C_Reg />} />
          <Route path="/investor-admin" element={<I_Admin />} />
          <Route path="/company-admin" element={<CPY_Admin />} />
          <Route path="/chatbot" element={<ChatBot />} />
          <Route path="/content-admin" element={<CON_Admin />} />
          <Route path="/about" element={<About />} />
          <Route path="/news" element={<News />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/company" element={<Company />} />
          <Route path="/company_management" element={<Com_Man />} />
          <Route path="/ads_management" element={<Ads_Man />} />
          <Route path="/ads" element={<Ads/>} />
          <Route path="/sales" element={<Sales/>} />
          <Route path="/forgot-password" element={<Forgot_Pass />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
