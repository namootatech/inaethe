import {
  BsAirplaneFill,
  BsFillHeartFill,
  BsFillPauseBtnFill,
} from 'react-icons/bs';

import { FaBeer, FaCoffee, FaHome, FaUser } from 'react-icons/fa';
import { FiSettings } from 'react-icons/fi';
import { GiCat } from 'react-icons/gi';
import { MdOutlineDashboard } from 'react-icons/md';
import { SiGooglemaps } from 'react-icons/si';
import { TbBrandGoogleMaps } from 'react-icons/tb';
import { VscAccount } from 'react-icons/vsc';
import { IoSettingsSharp } from 'react-icons/io5';
import { AiFillSetting } from 'react-icons/ai';
import { BiSolidDashboard } from 'react-icons/bi';
import { IoMdHome } from 'react-icons/io';
import { RiUserSettingsFill } from 'react-icons/ri';
import { BsFillGearFill } from 'react-icons/bs';
import { MdOutlineSettings } from 'react-icons/md';
import { MdOutlineHome } from 'react-icons/md';
import { MdOutlineAccountCircle } from 'react-icons/md';
import { MdOutlineSettingsApplications } from 'react-icons/md';

const icons = {
  airplane: BsAirplaneFill,
  beer: FaBeer,
  cat: GiCat,
  coffee: FaCoffee,
  dashboard: MdOutlineDashboard,
  googleMaps: TbBrandGoogleMaps,
  heart: BsFillHeartFill,
  home: IoMdHome,
  pause: BsFillPauseBtnFill,
  settings: FiSettings,
  user: FaUser,
  accountCircle: MdOutlineAccountCircle,
  settingsApplications: MdOutlineSettingsApplications,
  settingsSharp: IoSettingsSharp,
  gearFill: BsFillGearFill,
  solidDashboard: BiSolidDashboard,
  outlineHome: MdOutlineHome,
  outlineSettings: MdOutlineSettings,
  outlineAccountCircle: MdOutlineAccountCircle,
};

export const Icon = ({ name, size = 24, color = 'currentColor' }) => {
  const IconComponent = icons[name];
  if (!IconComponent) {
    console.error(`Icon "${name}" not found.`);
    return null;
  }
  return <IconComponent size={size} color={color} />;
};

export const getIcon = (name) => {
  const IconComponent = icons[name];
  if (!IconComponent) {
    console.error(`Icon "${name}" not found.`);
    return null;
  }
  return IconComponent;
};

export const getIconList = () => {
  return Object.keys(icons).map((iconName) => ({
    name: iconName,
    component: icons[iconName],
  }));
};

export const getIconByName = (name) => {
  return icons[name];
};

export const getIconNames = () => {
  return Object.keys(icons);
};
