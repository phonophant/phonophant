import { MenuItemProps } from 'piral';
import * as React from 'react';
import { Link } from 'react-router-dom';

export const MenuItem: React.FC<MenuItemProps> = ({ children, meta }) => {
  return (
    <Link to={meta.to} className="flex jusitfy-start items-center space-x-6 w-full focus:bg-blue-500 focus:text-white rounded mx-3 px-3 py-3 ">
      { children }
    </Link>
  );
}

export default MenuItem;