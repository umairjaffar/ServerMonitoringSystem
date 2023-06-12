import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import DescriptionIcon from "@mui/icons-material/Description";
import React from "react";

export const menu = [
  {
    icon: <HomeIcon />,
    title: "Home",
    to: "/dashboard",
    items: [],
  },
  {
    icon: <SchoolIcon />,
    title: "Marketing",
    items: [
      {
        title: "Product",
        items: [
          {
            title: "SCO",
            to: "/dashboard/sco",
          },
          {
            title: "PPC",
            to: "/dashboard/ppc",
          },
          {
            title: "SMM",
            to: "/dashboard/smm",
          },
        ],
      },
      {
        title: "Services",
        items: [
          {
            title: "Service1",
            to: "/dashboard/service1",
          },
          {
            title: "Service2",
            to: "/dashboard/service2",
          },
          {
            title: "Service3",
            to: "/dashboard/service3",
          },
        ],
      },
    ],
  },
  {
    icon: <TrendingDownIcon />,
    title: "Options",
  },
  {
    icon: <DescriptionIcon />,
    title: "Blog",
  },
];


export const unPaid = [
  {
    icon: <HomeIcon />,
    title: "Home",
    to: "/dashboard",
    items: [],
  },
  {
    icon: <SchoolIcon />,
    title: "Marketing",
    items: [
      {
        title: "Product",
        items: [
          {
            title: "SCO",
            to: "/dashboard/sco",
          },
          {
            title: "PPC",
            to: "/dashboard/ppc",
          },
          {
            title: "SMM",
            to: "/dashboard/smm",
          },
        ],
      },
    ],
  },
  {
    icon: <DescriptionIcon />,
    title: "Blog",
  },
];
