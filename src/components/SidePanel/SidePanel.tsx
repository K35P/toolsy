import React from "react";
import "./SidePanel.css";
import toolsyLogo from "../../assets/toolsy-logo.svg";

const SidePanel = () => {
  return (
    <aside className='side-panel'>
        <div className='flex items-center justify-center'>
            <img src={toolsyLogo} alt="Toolsy Logo" style={{width: '150px'}} />
        </div>

        <div className="mt-6">
            <ul className="list-none p-0 w-full">
                <li className="menu-li">Home</li>
                <li className="menu-li">My Files</li>
                <li className="menu-li">Settings</li>
            </ul>
        </div>
    </aside>
  );
};

export default SidePanel;
