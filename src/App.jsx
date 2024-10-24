// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Visualize_filteration from "./components/visualize/ForceGraph3D";
import ForceGraph2DComponent from "./components/ForceGraph2d";
import Sidebar from "./components/Buttons/SIdeBar";
import MainContent from "./components/Maincontent/Maincontent";
import "./App.css";
// import FileUploadSection from "./components/FileUpload/FileUpload";
import FileUploadSection from "./components/FileUpload/uploadworking";

const App = () => {
  return (
    <Router>  
      <div className="App"> 
        {/* 
        <Sidebar className="App-header">

             <Sidebar/>
        </Sidebar> */}

        <main>
          <div>
            <div>
              <Routes>
                {/* <Route path="/" element={<Sidebar />} /> */}

                <Route path="/" element={<FileUploadSection />} />
                <Route path="/visualize" element={<Visualize_filteration />} />
                {/* <Route path="/CONFIGURATION" element={<MainContent />} /> */}
                <Route path="/3d_graph" element={<ForceGraph2DComponent />} />
                <Route path="/upload" element={<FileUploadSection />} />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </Router>
  );
};

export default App;
