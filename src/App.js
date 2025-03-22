import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Home from "./page-component/home";

export default function App() {
  return(
    <>
      <Router basename="/zenscreen">
        <Routes>
          <Route path="/*" element={<Home />}></Route>
          <Route path="/home" element={<Home />}></Route>
        </Routes>
      </Router>
    </>
  )
}