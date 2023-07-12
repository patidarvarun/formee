import React from 'react';
import IcoMoon from 'react-icomoon';
const iconSet = require('./selection.json');

const CustomIcon = ({
  size,
  className,
  ...props
}) => {
  return <IcoMoon iconSet={iconSet} {...props} className={`fs-${size} w-${size} h-${size} ${className}`} style={{ fontSize: size, width: size, height: size }} />;
};

export default CustomIcon;