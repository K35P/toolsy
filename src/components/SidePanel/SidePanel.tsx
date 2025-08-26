import React, { useEffect } from "react";
import toolsyLogo from "../../assets/toolsy-logo.svg";
import { DocumentIcon, HomeIcon, Cog8ToothIcon, ChevronLeftIcon } from "@heroicons/react/24/outline"
import { useGlobalContext } from "@/context/GlobalContext";

const SidePanel: React.FC = () => {
  const { isSidePanelClosed, setIsSidePanelClosed } = useGlobalContext();

  const handleToggleSidePanel = () => {
    setIsSidePanelClosed((prev: boolean) => !prev);
    console.log("Side panel toggled");
  };

  return (
    <aside className={`${isSidePanelClosed ? 'side-panel closed' : 'side-panel'}`}>
      
        <div className="collapse-icon" onClick={handleToggleSidePanel}>
          <ChevronLeftIcon className="size-4" />
        </div>

        <div className='flex items-center justify-start'>
            <img src={toolsyLogo} className="toolsy-logo" alt="Toolsy Logo" style={{width: '150px'}} />
        </div>

        <div className="mt-6">
            <ul className="list-none p-0 w-full">
                <li className="menu-li"><HomeIcon className="size-5" /> Home</li>
                <li className="menu-li"><DocumentIcon className="size-5" /> My Files</li>
                <li className="menu-li"><Cog8ToothIcon className="size-5" />Settings</li>
            </ul>
        </div>
    </aside>
  );
};

export default SidePanel;
