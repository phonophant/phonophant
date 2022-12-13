import * as React from 'react';
import { Link } from 'react-router-dom';
import { ComponentsState, ErrorComponentsState, Menu, Notifications, SwitchErrorInfo } from 'piral';
import MenuContainer from './components/MenuContainer';
import MenuItem from './components/MenuItem';

const defaultTiles = (
  <>
    <div className="tile rows-2 cols-2">
      <div className="teaser">
        <a href="https://piral.io/">Piral</a>
        <br />
        for next generation portals
      </div>
    </div>
    <div className="tile rows-2 cols-2">
      <div className="teaser">
        <a href="https://www.typescriptlang.org/">TypeScript</a>
        <br />
        for writing scalable web apps
      </div>
    </div>
    <div className="tile rows-2 cols-2">
      <div className="teaser">
        <a href="https://reactjs.org/">React</a>
        <br />
        for building components
      </div>
    </div>
    <div className="tile rows-2 cols-2">
      <div className="teaser">
        <a href="http://getbootstrap.com/">Bootstrap</a>
        <br />
        for layout and styling
      </div>
    </div>
    <div className="tile rows-2 cols-2">
      <div className="teaser">
        <a href="https://sass-lang.com">Sass</a>
        <br />
        for crafting custom styles
      </div>
    </div>
  </>
);

export const errors: Partial<ErrorComponentsState> = {
  not_found: () => (
    <div>
      <p className="error">Could not find the requested page. Are you sure it exists?</p>
      <p>
        Go back <Link to="/">to the dashboard</Link>.
      </p>
    </div>
  ),
};

export const layout: Partial<ComponentsState> = {
  ErrorInfo: (props) => (
    <div>
      <h1>Error</h1>
      <SwitchErrorInfo {...props} />
    </div>
  ),
  DashboardContainer: ({ children }) => (
    <div>
      <h1>Hello, world!</h1>
      <p>Welcome to your new microfrontend app shell, built with:</p>
      <div className="tiles">
        {defaultTiles}
        {children}
      </div>
    </div>
  ),
  DashboardTile: ({ columns, rows, children }) => <div className={`tile cols-${columns} rows-${rows}`}>{children}</div>,
  Layout: ({ children }) => (
    <div className="h-screen w-screen flex">
      <Notifications />
      <Menu type="general" />
      <div className="container bg-gray-50 overflow-y-scroll">{children}</div>
    </div>
  ),
  MenuContainer: MenuContainer,
  MenuItem: MenuItem,
  NotificationsHost: ({ children }) => <div className="notifications">{children}</div>,
  NotificationsToast: ({ options, onClose, children }) => (
    <div className={`notification-toast ${options.type}`}>
      <div className="notification-toast-details">
        {options.title && <div className="notification-toast-title">{options.title}</div>}
        <div className="notification-toast-description">{children}</div>
      </div>
      <div className="notification-toast-close" onClick={onClose} />
    </div>
  ),
};
