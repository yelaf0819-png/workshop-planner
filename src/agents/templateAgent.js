export const templateAgent = {
  save({ projectId }, { name }, workshopStore, templateStore) {
    const project = workshopStore.getState().projects.find((p) => p.id === projectId)
    if (!project) return { success: false }
    const templateId = templateStore.getState().saveTemplate(project, name)
    workshopStore.updateProject(projectId, {
      retrospective: {
        ...project.retrospective,
        savedAsTemplate: true,
        templateId,
      },
    })
    return { success: true, templateId }
  },

  load({ templateId }, templateStore) {
    return templateStore.getState().getTemplateById(templateId)
  },

  clone({ projectId }, { overrides }, store) {
    const newId = store.cloneProject(projectId, overrides)
    return { success: true, projectId: newId }
  },
}
