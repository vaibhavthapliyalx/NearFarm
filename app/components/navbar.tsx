'use client';
// Importing necessary libraries and components
import React, { useState } from 'react';
import { AppBar, Toolbar, IconButton, Drawer, List, ListItemButton, ListItemText, Avatar, Badge, useMediaQuery, ThemeProvider, createTheme, BottomNavigation, BottomNavigationAction, Slide, Box, Menu, MenuItem } from '@mui/material';
import { motion } from 'framer-motion';
import HomeIcon from '@mui/icons-material/Home';
import MailIcon from '@mui/icons-material/Mail';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MenuIcon from '@mui/icons-material/Menu';
import { theme } from '../constants';
import { useRouter } from 'next/navigation';




export default function NavigationBar() {
  const [value, setValue] = useState(0);
  const [isMenuOpen, setMenuOpen] = useState(false);

  const router = useRouter();


// Avatar on click function
const [anchorEl, setAnchorEl] = useState(null);

const handleAvatarClick = (event: any) => {
  setAnchorEl(event.currentTarget);
};

const handleMenuClose = () => {
  setAnchorEl(null);
};

const handleProfileClick = () => {
  router.push('/profile');
  // Navigate to profile page
  handleMenuClose();
};

const handleLogoutClick = () => {
  // Perform logout
  router.push('/login');
  handleMenuClose();
};


  const handleMenuToggle = () => {
    setMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };


  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const list = () => (
    <Box sx={{ padding: theme.spacing(2) }}>
      <List>
        <ListItemButton onClick={closeMenu}>
          <HomeIcon />
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton onClick={closeMenu}>
          <Badge badgeContent={88} color="error">
            <MailIcon />
          </Badge>
          <ListItemText primary="Messages" />
        </ListItemButton>
        <ListItemButton onClick={closeMenu}>
          <Badge badgeContent={5} color="error">
            <NotificationsIcon />
          </Badge>
          <ListItemText primary="Notifications" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <ThemeProvider theme={theme}>
      {!isMobile ? (
        <AppBar position="static" color="primary">
          <Toolbar>
            
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleMenuToggle}>
            <Badge badgeContent= {""} color='error'>
              <MenuIcon />
            </Badge>
            </IconButton>
            
            <p>LOGO</p>
            <Drawer anchor="left" open={isMenuOpen} onClose={closeMenu}>
              {list()}
            </Drawer>
            <Avatar sx={{ marginLeft: 'auto' }} onClick={handleAvatarClick}>U</Avatar> {/* Profile Avatar */}
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleProfileClick}>Profile</MenuItem>
              <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
      ) : (
        <Slide direction="up" in={true} mountOnEnter unmountOnExit>
          <BottomNavigation
            value={value}
            onChange={(event, newValue) => {
              setValue(newValue);
            }}
            showLabels
            sx={{ width: '100%', position: 'fixed', bottom: 0 }}
          >
            <BottomNavigationAction label="Home" icon={<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><HomeIcon /></motion.div>} />
            <BottomNavigationAction label="Messages" icon={<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Badge badgeContent={2} color="error"><MailIcon /></Badge></motion.div>} />
            <BottomNavigationAction label="Notifications" icon={<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Badge badgeContent={5} color="error"><NotificationsIcon /></Badge></motion.div>} />
            <BottomNavigationAction label="Profile" icon={<motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}><Avatar sx={{ width: 24, height: 24 }}>U</Avatar></motion.div>} />
          </BottomNavigation>
        </Slide>
      )}
    </ThemeProvider>
  );
};
