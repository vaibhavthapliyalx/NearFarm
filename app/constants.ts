import { createTheme } from "@mui/material";

export const sidebarLinks = [
    {
      imgURL: "/assets/home.svg",
      route: "/",
      label: "Home",
    },
    {
      imgURL: "/assets/search.svg",
      route: "/search",
      label: "Search",
    },
    {
      imgURL: "/assets/heart.svg",
      route: "/activity",
      label: "Activity",
    },
    {
      imgURL: "/assets/create.svg",
      route: "/create-thread",
      label: "Create Thread",
    },
    {
      imgURL: "/assets/community.svg",
      route: "/communities",
      label: "Communities",
    },
    {
      imgURL: "/assets/user.svg",
      route: "/profile",
      label: "Profile",
    },
  ];
  
  export const profileTabs = [
    { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
    { value: "replies", label: "Replies", icon: "/assets/members.svg" },
    { value: "tagged", label: "Tagged", icon: "/assets/tag.svg" },
  ];
  
  export const communityTabs = [
    { value: "threads", label: "Threads", icon: "/assets/reply.svg" },
    { value: "members", label: "Members", icon: "/assets/members.svg" },
    { value: "requests", label: "Requests", icon: "/assets/request.svg" },
  ];

  export const theme = createTheme({
    palette: {
      primary: {
        main: '#1976d6', // Change this to your preferred color
      },
      secondary: {
        main: '#dc004e', // Change this to your preferred color
      },
    },
  });