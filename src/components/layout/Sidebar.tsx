"use client";

import { Upload } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import MapIcon from "@mui/icons-material/Map";
import PersonIcon from "@mui/icons-material/Person";
import {
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar
} from "@mui/material";
import { alpha, type Theme } from "@mui/material/styles";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const drawerWidth = 264;

const menuItems = [
  { text: "Dashboard", icon: DashboardIcon, href: "/dashboard" },
  { text: "Profile", icon: PersonIcon, href: "/profile" },
  { text: "Maps", icon: MapIcon, href: "/maps" },
  { text: "Raise Issue", icon: Upload, href: "/raise-issue" }
] as const;

function routeIsActive(pathname: string, href: string) {
  if (pathname === href) return true;
  if (href === "/") return false;
  return pathname.startsWith(`${href}/`);
}

export default function Sidebar({
  mobileOpen,
  onClose
}: {
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  const drawerPaperSx = {
    width: drawerWidth,
    boxSizing: "border-box" as const,
    borderRight: "1px solid",
    borderColor: "divider",
    bgcolor: "background.paper",
    backgroundImage: (theme: Theme) =>
      `linear-gradient(180deg, ${alpha(theme.palette.primary.main, 0.06)} 0%, transparent 42%)`
  };

  const drawerContent = (
    <>
      <Toolbar sx={{ minHeight: { xs: 56, sm: 64 } }} />

      <Divider sx={{ mx: 2 }} />

      <List
        component="nav"
        aria-label="Main navigation"
        sx={{
          px: 1.5,
          py: 2,
          display: "flex",
          flexDirection: "column",
          gap: 0.5
        }}
      >
        {menuItems.map((item) => {
          const Icon = item.icon;
          const active = routeIsActive(pathname, item.href);

          return (
            <ListItemButton
              key={item.text}
              component={Link}
              href={item.href}
              onClick={onClose}
              selected={active}
              sx={{
                borderRadius: 1,
                py: 1.1,
                px: 1.25,
                "&.Mui-selected": {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.12),
                  color: "primary.main",
                  "&:hover": {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.18)
                  },
                  "& .MuiListItemIcon-root": {
                    color: "primary.main"
                  }
                },
                "&:hover:not(.Mui-selected)": {
                  bgcolor: (theme) => alpha(theme.palette.primary.main, 0.06)
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: active ? "primary.main" : "text.secondary"
                }}
              >
                <Icon fontSize="small" />
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{
                  fontWeight: 600,
                  fontSize: "0.9375rem"
                }}
              />
            </ListItemButton>
          );
        })}
      </List>
    </>
  );

  return (
    <>
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": drawerPaperSx
        }}
        open
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": drawerPaperSx
        }}
      >
        {drawerContent}
      </Drawer>
    </>
  );
}
