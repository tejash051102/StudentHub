import Activity from '../models/Activity.js';

export async function logActivity(actor, action, entity = '', metadata = {}) {
  try {
    await Activity.create({ actor, action, entity, metadata });
  } catch (error) {
    console.warn('Activity log failed:', error.message);
  }
}
