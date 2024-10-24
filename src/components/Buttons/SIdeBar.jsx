import React from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
    return (
        <div className="sidebar">
            
            <button><Link to="/main">CONFIGURATION</Link>  </button>
            <button><Link to="/upload">UPLOAD DATA</Link></button>
            <button ><Link to="/visualize">VISUALIZE</Link></button>
        </div>
    );   
}

export default Sidebar;

