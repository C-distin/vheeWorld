import { getAllProjects } from "@/app/actions/projects"
import { ProjectsPageClient } from "./projects-page-client"

export default async function ProjectsPage() {
  const allProjects = await getAllProjects()
  return <ProjectsPageClient projects={allProjects} />
}
