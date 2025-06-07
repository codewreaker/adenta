import { FC, useRef, useState } from 'react';

import ColorWheelComponent, { type ColorWheelProps } from './ColorWheel';
import { EyeDropperIcon } from '@heroicons/react/24/outline';

import './colorpicker.css';
import ThemeToggle from '../ThemeToggle';

const ColorPicker: FC<ColorWheelProps> = (props) => {
  const cRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const onToggle = () => {
    setIsOpen((prev) => {
      cRef.current?.style.setProperty('opacity', prev ? '0' : '1');
      return !prev;
    });
  };
  return (
    <>
      <ThemeToggle
        onToggle={onToggle}
        isDark={isOpen}
        alternate={false}
        darkIcon={<EyeDropperIcon />}
      />
      <ColorWheelComponent ref={cRef} {...props} />
    </>
  );
};

export default ColorPicker;
