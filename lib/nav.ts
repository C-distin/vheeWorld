import {
  IconChartBar,
  IconFileFilled,
  IconHeart,
  IconHome,
  IconSettings,
  IconShield,
  IconUsers,
} from "@tabler/icons-react"

export type Role = "admin" | "user"

export const adminNav = [
  {
    group: "Overview",
    items: [
      { label: "Dasboard", href: "/dashboard/admin", icon: IconHome },
      { label: "Analytics", href: "/dashboard/admin/analytics", icon: IconChartBar },
    ],
  },

  {
    group: "Management",
    items: [
      { label: "Users", href: "/dashboard/admin/users", icon: IconUsers },
      { label: "Donations", href: "/dashboard/admin/donations", icon: IconHeart },
      { label: "Content", href: "/dashboard/admin/content", icon: IconFileFilled },
    ],
  },

  {
    group: "System",
    items: [
      { label: "Settings", href: "/dashboard/admin/settings", icon: IconSettings },
      { label: "Roles & Permission", href: "/dashboard/admin/roles", icon: IconShield },
    ],
  },
]

export const userNav = [
  {
    group: "My Account",
    items: [
      { label: "Home", href: "/dashboard/user", icon: IconHome },
      { label: "Donations", href: "/dashboard/user/donations", icon: IconHeart },
    ],
  },

  {
    group: "Work",
    items: [
      { label: "Blog", href: "/dashboard/user/blog", icon: IconFileFilled },
      { label: "Projects", href: "/dashboard/user/projects", icon: IconFileFilled },
    ],
  },

  {
    group: "Account",
    items: [{ label: "Settings", href: "/dashboard/user/settings", icon: IconSettings }],
  },
]
