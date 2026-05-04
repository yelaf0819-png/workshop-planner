import { projectAgent } from './projectAgent'
import { sessionAgent } from './sessionAgent'
import { sheetGenerator } from './sheetGenerator'
import { trackerAgent } from './trackerAgent'
import { liveOpsAgent } from './liveOpsAgent'
import { summaryAgent } from './summaryAgent'
import { templateAgent } from './templateAgent'

const orchestrator = {
  handle(action, payload, store) {
    const { type, projectId, sessionId } = payload
    const ctx = { projectId, sessionId, store }

    switch (action) {
      case 'CREATE_PROJECT':      return projectAgent.create(payload, store)
      case 'UPDATE_PROJECT':      return projectAgent.update(payload, store)
      case 'VALIDATE_PROJECT':    return projectAgent.validate(payload)
      case 'SAVE_SESSION':        return sessionAgent.save(ctx, payload)
      case 'PARSE_SESSION':       return sessionAgent.parse(payload)
      case 'GENERATE_SHEET':      return sheetGenerator.generate(ctx, store)
      case 'MAKE_SHARE_LINK':     return sheetGenerator.makeShareLink(ctx, store)
      case 'UPDATE_STATUS':       return trackerAgent.updateStatus(ctx, payload, store)
      case 'TOGGLE_CHECKLIST':    return trackerAgent.toggleChecklist(ctx, payload, store)
      case 'SCHEDULE_ALERT':      return trackerAgent.scheduleAlert(ctx, payload, store)
      case 'LOG_TIMELINE':        return liveOpsAgent.logTimeline(ctx, payload, store)
      case 'ADD_LIVE_NOTE':       return liveOpsAgent.addNote(ctx, payload, store)
      case 'ADD_INCIDENT':        return liveOpsAgent.addIncident(ctx, payload, store)
      case 'SUMMARIZE_PROJECT':   return summaryAgent.summarize(ctx, store)
      case 'SAVE_TEMPLATE':       return templateAgent.save(ctx, payload, store)
      case 'LOAD_TEMPLATE':       return templateAgent.load(payload, store)
      case 'CLONE_PROJECT':       return templateAgent.clone(ctx, payload, store)
      default:
        console.warn('[Orchestrator] Unknown action:', action)
        return null
    }
  },
}

export default orchestrator
