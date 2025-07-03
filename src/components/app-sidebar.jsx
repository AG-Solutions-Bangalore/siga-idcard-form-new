import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import { ContextPanel } from "@/lib/ContextPanel";
import { NavMainUpdate } from "./nav-main-update";
import { NavMainReport } from "./nav-main-report";

export function AppSidebar({ ...props }) {
  // const {emailL,nameL,userType} = React.useContext(ContextPanel)
  const nameL = localStorage.getItem("name");
  const emailL = localStorage.getItem("email");
  const userType = localStorage.getItem("userType");
  const pageControl = JSON.parse(localStorage.getItem("pageControl")) || [];

  const data = {
    user: {
      name: `${nameL}`,
      email: `${emailL}`,
      avatar: "/avatars/shadcn.jpg",
    },
    teams: [
      {
        name: "SIGA FAIR ",
        logo: GalleryVerticalEnd,
        plan: "AgSolution",
      },
      {
        name: "Acme Corp.",
        logo: AudioWaveform,
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: Command,
        plan: "Free",
      },
    ],
    navMain: [
      {
        title: "Payment Mediation",
        url: "/amount",
        icon: Settings2,
      },
      {
        title: "Business Expansion",
        url: "/business-opp",
        icon: BookOpen,
      },
      {
        title: "Job Offered",
        url: "/job-offered",
        icon: SquareTerminal,
      },
      {
        title: "Job Require",
        url: "/job-require",
        icon: SquareTerminal,
      },
    ],
    navMain1: [
      {
        title: "Directory",
        url: "/directory",
        icon: Bot,
      },

      {
        title: "Latest News",
        url: "/latest-news",
        icon: SquareTerminal,
      },
    ],
    navReport: [
      {
        title: "Participant Summary",
        url: "/participant-summary",
        icon: Bot,
      },
      {
        title: "User Management",
        url: "/user-management",
        icon: Bot,
      },
    ],
    projects: [
      {
        name: "Dashboard",
        url: "/home",
        icon: Frame,
      },
      {
        name: "Participant",
        url: "/participation",
        icon: Map,
      },
      {
        name: "Registrations",
        url: "/registrations",
        icon: PieChart,
      },
      {
        name: "Id Card",
        url: "/participant",
        icon: Map,
      },
      {
        name: "MSME",
        url: "/msme",
        icon: Map,
      },
    ],
  };
  const filterItemsByPermission = (items) => {
    return items.filter((item) => {
      // Remove leading slash from item URL for comparison
      const itemUrl = item.url.replace(/^\//, "");

      const routeData = pageControl.find((route) => {
        return route.url === itemUrl;
      });

      if (!routeData) return false;

      // const allowedUsers = routeData.usertype.split(',');
      const allowedUsers = routeData?.usertype
        ? routeData.usertype.split(",")
        : [];
      return allowedUsers.includes(userType) && routeData.status === "Active";
    });
  };

  const filteredNavMain = filterItemsByPermission(data.navMain);
  const filteredNavMain1 = filterItemsByPermission(data.navMain1);
  const filteredNavReport = filterItemsByPermission(data.navReport);
  const filteredProjects = filterItemsByPermission(data.projects);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
      </SidebarHeader>
      <SidebarContent>
        <NavProjects projects={filteredProjects} />
        <NavMain items={filteredNavMain} />
        <NavMainUpdate items={filteredNavMain1} />
        <NavMainReport items={filteredNavReport} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
