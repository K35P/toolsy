import React from "react";
import toolsyLogo from "../../assets/toolsy-logo.svg";
import toolsyLogoClosed from "../../assets/toolsy-logo-2.svg";
import { DocumentIcon, HomeIcon, Cog8ToothIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"
import { useGlobalContext } from "@/context/GlobalContext";

const SidePanel: React.FC = () => {
  const { isSidePanelClosed, handleToggleSidePanel } = useGlobalContext();

  return (
    <aside className={`${isSidePanelClosed ? 'side-panel closed' : 'side-panel'}`}>
      
        <div className="collapse-icon" onClick={handleToggleSidePanel}>
          {!isSidePanelClosed ? <ChevronLeftIcon className="size-3" /> : <ChevronRightIcon className="size-3" />}
        </div>

        <div
          className={`relative flex items-center justify-center transition-all duration-500 ease-in-out 
            ${isSidePanelClosed ? "w-[40px]" : "w-[150px]"} h-[40px]`}
        >
          {/* Full logo */}
          <img
            src={toolsyLogo}
            alt="Toolsy Logo"
            className={`
              toolsy-logo absolute transition-all duration-500 ease-in-out
              ${isSidePanelClosed ? "opacity-0 scale-90" : "opacity-100 scale-100"}
            `}
            style={{ width: "150px" }}
          />

          {/* Collapsed logo */}
          <img
            src={toolsyLogoClosed}
            alt="Toolsy Logo Closed"
            className={`
              toolsy-logo-closed absolute transition-all duration-500 ease-in-out ml-3
              ${isSidePanelClosed ? "opacity-100 scale-100" : "opacity-0 scale-90"}
            `}
            style={{ width: "30px" }}
          />
        </div>

        <div className="mt-6">
          <ul className="list-none p-0 w-full">
            <li className="menu-li">
              <HomeIcon className="size-5 shrink-0" />
              <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${isSidePanelClosed ? "opacity-0 w-0" : "opacity-100 w-auto ml-2"}`}>Home</span>
            </li>

            <li className="menu-li">
              <DocumentIcon className="size-5 shrink-0" />
              <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${isSidePanelClosed ? "opacity-0 w-0" : "opacity-100 w-auto ml-2"}`}>My Files</span>
            </li>

            <li className="menu-li">
              <Cog8ToothIcon className="size-5 shrink-0" />
              <span className={`transition-all duration-300 whitespace-nowrap overflow-hidden ${isSidePanelClosed ? "opacity-0 w-0" : "opacity-100 w-auto ml-2"}`}>Settings</span>
            </li>
          </ul>
        </div>
    </aside>
  );
};

export default SidePanel;
