import { Folder, Forward, MoreHorizontal, Trash2 } from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar"
import { Link } from "react-router-dom";

export function NavProjects({
  projects
}) {
  const { isMobile } = useSidebar()
  const buttonVariants = {
    hover: { scale: 1.05 },
  };
  if(!projects || projects.length === 0) {
    return null 
  }
  const hasActiveItems = projects.length > 0;
  if(!hasActiveItems){
    return null
  }
  return (
    (<SidebarGroup >
      <SidebarGroupLabel>Event</SidebarGroupLabel>
      <SidebarMenu>
        {projects.map((item) => (
          
           <motion.div
           variants={buttonVariants}
           whileHover="hover" 
           key={item.name}
       
         >
          <SidebarMenuItem key={item.name}>
            <SidebarMenuButton asChild  tooltip={item.name}>
           
              <Link to={item.url}>
                <item.icon />
                <span className="transition-colors duration-200 hover:text-blue-500">{item.name}</span>
              </Link>
          
            </SidebarMenuButton>
      
            {/* <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuAction showOnHover>
                  <MoreHorizontal />
                  <span className="sr-only">More</span>
                </SidebarMenuAction>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-48 rounded-lg"
                side={isMobile ? "bottom" : "right"}
                align={isMobile ? "end" : "start"}>
                <DropdownMenuItem>
                  <Folder className="text-muted-foreground" />
                  <span>View Project</span>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Forward className="text-muted-foreground" />
                  <span>Share Project</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Trash2 className="text-muted-foreground" />
                  <span>Delete Project</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu> */}
          </SidebarMenuItem>
          </motion.div>
        ))}
        {/* <SidebarMenuItem>
          <SidebarMenuButton className="text-sidebar-foreground/70">
            <MoreHorizontal className="text-sidebar-foreground/70" />
            <span>More</span>
          </SidebarMenuButton>
        </SidebarMenuItem> */}
      </SidebarMenu>
    </SidebarGroup>)
  );
}
