const generateId = () => Math.random().toString(36).substr(2, 9)

export function createShareLink(projectId) {
  const linkId = generateId()
  const base = window.location.origin
  return {
    linkId,
    url: `${base}/shared/${linkId}`,
    projectId,
    createdAt: new Date().toISOString(),
  }
}

export function getSharedProject(linkId, projects) {
  return projects.find((p) => p.share?.linkId === linkId) || null
}
