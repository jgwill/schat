import { ApiActionType, ApiActionPayload } from '../types';

export const MIA_API_EVENT_NAME = 'miaApiAction';

/**
 * Triggers a simulated API action by dispatching a custom event.
 * @param actionType The type of action to perform.
 * @param payload The data associated with the action.
 */
export const triggerMiaApiAction = (actionType: ApiActionType, payload?: any): void => {
  const eventDetail: ApiActionPayload = { actionType, payload };
  
  try {
    const apiEvent = new CustomEvent(MIA_API_EVENT_NAME, { detail: eventDetail });
    window.dispatchEvent(apiEvent);
    console.log(`ApiService: Dispatched '${MIA_API_EVENT_NAME}' for action '${actionType}' with payload:`, payload);
  } catch (error) {
    console.error(`ApiService: Error dispatching event for action '${actionType}':`, error);
  }
};
