
import { Home } from 'lucide-react';
import { Drone } from 'lucide-react';
import { HopOff } from 'lucide-react';
import { Settings } from 'lucide-react';
import { UserCircle } from 'lucide-react';
import { MapPin, Scale, User, Leaf, Sprout, Cloud, ClipboardList, CalendarCheck, DollarSign } from "lucide-react";



export const navItems=[
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "Farms",
      url: "/farms",
      icon: Sprout, 
    },
    {
      title: "Users",
      url: "/users",
      icon: UserCircle,
    },
    {
      title: "Sensors",
      url: "/sensors",
      icon: Drone,
    },
    {
      title: "Crops",
      url: "/crops",
      icon: HopOff,
    },
    {
      title: "Account",
      url: "/account",
      icon: Settings,
    },
    
    

]



export const cardData = [
 
  {
    title: "Active Farm Users",
    value: "12",
    description: "Managers, agronomists & workers",
    icon: User,
    bgColor: "bg-blue-100"
  },
  {
    title: "Total Crop Acreage",
    value: "86",
    description: "Combined active growing area (acres)",
    icon: Leaf,
    bgColor: "bg-lime-100"
  },
  {
    title: "Upcoming Harvests",
    value: "3",
    description: "Crops expected to mature soon",
    icon: CalendarCheck,
    bgColor: "bg-yellow-100"
  },
  
  
  
  
  {
    title: "Pending Tasks",
    value: "14",
    description: "Scheduled farm activities",
    icon: ClipboardList,
    bgColor: "bg-orange-100"
  },
  
];
