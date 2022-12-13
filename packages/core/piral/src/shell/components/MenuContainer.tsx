import { MenuContainerProps } from 'piral';
import { IoCardOutline, IoExtensionPuzzleOutline, IoSettingsOutline } from "react-icons/io5";
import * as React from 'react';
import MenuItem from './MenuItem';
import { PhonophantLogo } from './PhonophantLogo';

export const MenuContainer: React.FC<MenuContainerProps> = ({ children }) => {
  const [collapsed, setCollapsed] = React.useState(true);
  return (
    <aside className="xl:rounded-r h-full w-96 flex-col">
      <nav className="px-4 py-6">
        <div className="container">
          <div className="flex justify-center items-center space-x-3">
            <PhonophantLogo />
          </div>
          <div className="mt-12 flex flex-col justify-start items-center w-full border-gray-600 border-b pb-5 ">
            <MenuItem type="general" meta={{}}>
              <IoExtensionPuzzleOutline size="23" />
              <p className="text-base leading-4 font-bold">Plugins</p>
            </MenuItem>
            <MenuItem type="general" meta={{}}>            
              <IoCardOutline size="23" />
              <p className="text-base leading-4 font-bold">Trigger</p>
            </MenuItem>
            <MenuItem type="general" meta={{}}>            
              <IoSettingsOutline size="23" />
              <p className="text-base leading-4 font-bold">Settings</p>
            </MenuItem>
          </div>
          <button
            aria-label="Toggle navigation"
            type="button"
            onClick={() => setCollapsed(!collapsed)}
            className="navbar-toggler mr-2">
            <span className="navbar-toggler-icon" />
          </button>
          <div
            className={`collapse navbar-collapse d-sm-inline-flex flex-sm-row-reverse ${collapsed ? '' : 'show'}`}
            aria-expanded={!collapsed}>
            <ul className="navbar-nav flex-grow">
              {children}
            </ul>
          </div>
        </div>
      </nav>
    </aside>
  );
}

export default MenuContainer;