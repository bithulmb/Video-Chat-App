import { useState } from "react";
import "./App.css";
import { Button } from "./components/ui/button";
import { BrowserRouter, Route, Routes } from "react-router";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { Toaster } from "./components/ui/sonner";



function App() {
  

  return (
    <>
    <BrowserRouter>
    <Routes>
      <Route path = "/login" element = {<LoginPage/>} />
      <Route path = "/home" element = {<HomePage/>} />
      <Route path = "/register" element = {<RegisterPage/>} />
    </Routes>
    
    </BrowserRouter>

    <Toaster/>
    </>
  );
}

export default App;
