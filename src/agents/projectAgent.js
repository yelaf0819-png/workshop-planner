import { validateSessions } from '../utils/validateInterval'

export const projectAgent = {
  create(payload, store) {
    const errors = this.validate(payload)
    if (errors.length > 0) return { success: false, errors }
    const id = store.createProject(payload)
    return { success: true, projectId: id }
  },

  update(payload, store) {
    const { projectId, ...data } = payload
    store.updateProject(projectId, data)
    return { success: true }
  },

  validate(payload) {
    const errors = []
    if (!payload.name?.trim()) errors.push('프로젝트명을 입력해주세요.')
    if (!payload.totalSessions || payload.totalSessions < 1)
      errors.push('차수는 1 이상이어야 합니다.')
    return errors
  },

  validateInterval(sessions) {
    return validateSessions(sessions)
  },
}
