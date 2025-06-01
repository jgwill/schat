
import { Message, AppSettings } from '../types'; // Added AppSettings
import { LOCAL_STORAGE_CLOUD_SESSION_PREFIX } from '../constants';

// Simulate network delay
const simulateDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

interface CloudSessionData {
  messages: Message[];
  settings: AppSettings;
}

/**
 * Simulates saving a chat session and its associated settings to Upstash Redis.
 */
export const saveSessionToCloud = async (sessionId: string, messages: Message[], settings: AppSettings): Promise<void> => {
  if (!sessionId.trim()) {
    console.error("Cloud Session ID cannot be empty.");
    throw new Error("Cloud Session ID cannot be empty.");
  }
  console.log(`Simulating save to Upstash Redis for session ID: ${sessionId}.`);
  await simulateDelay(500); 

  try {
    const dataToSave: CloudSessionData = {
      messages: messages.map(msg => ({ ...msg, timestamp: msg.timestamp.toISOString() as any })), // Ensure timestamp is string
      settings: settings,
    };
    const serializedData = JSON.stringify(dataToSave);
    localStorage.setItem(`${LOCAL_STORAGE_CLOUD_SESSION_PREFIX}${sessionId}`, serializedData);
    console.log(`Session ${sessionId} (messages and settings) 'saved' to simulated cloud (localStorage).`);
  } catch (error) {
    console.error(`Error 'saving' session ${sessionId} to simulated cloud:`, error);
    throw error; 
  }
};

/**
 * Simulates loading a chat session (messages and settings) from Upstash Redis.
 */
export const loadSessionFromCloud = async (sessionId: string): Promise<CloudSessionData | null> => {
  if (!sessionId.trim()) {
    console.error("Cloud Session ID cannot be empty for loading.");
    return null;
  }
  console.log(`Simulating load from Upstash Redis for session ID: ${sessionId}.`);
  await simulateDelay(500);

  try {
    const serializedData = localStorage.getItem(`${LOCAL_STORAGE_CLOUD_SESSION_PREFIX}${sessionId}`);
    if (serializedData === null) {
      console.log(`Session ${sessionId} not found in simulated cloud.`);
      return null;
    }
    const parsedData: CloudSessionData = JSON.parse(serializedData);
    
    // Ensure messages have Date objects for timestamps
    parsedData.messages = parsedData.messages.map((msg: any) => ({
      ...msg,
      timestamp: new Date(msg.timestamp)
    }));

    console.log(`Session ${sessionId} (messages and settings) 'loaded' from simulated cloud (localStorage).`);
    return parsedData;
  } catch (error) {
    console.error(`Error 'loading' session ${sessionId} from simulated cloud:`, error);
    localStorage.removeItem(`${LOCAL_STORAGE_CLOUD_SESSION_PREFIX}${sessionId}`); 
    return null;
  }
};

/**
 * Simulates listing all available session IDs from Upstash Redis.
 */
export const listCloudSessions = async (): Promise<string[]> => {
  console.log("Simulating listing sessions from Upstash Redis.");
  await simulateDelay(300);

  const sessionIds: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith(LOCAL_STORAGE_CLOUD_SESSION_PREFIX)) {
      sessionIds.push(key.replace(LOCAL_STORAGE_CLOUD_SESSION_PREFIX, ''));
    }
  }
  console.log("Available simulated cloud sessions:", sessionIds);
  return sessionIds.sort();
};

/**
 * Simulates deleting a chat session from Upstash Redis.
 */
export const deleteCloudSession = async (sessionId: string): Promise<void> => {
  if (!sessionId.trim()) {
    console.error("Cloud Session ID cannot be empty for deletion.");
    throw new Error("Cloud Session ID cannot be empty for deletion.");
  }
  console.log(`Simulating delete from Upstash Redis for session ID: ${sessionId}.`);
  await simulateDelay(400);

  try {
    localStorage.removeItem(`${LOCAL_STORAGE_CLOUD_SESSION_PREFIX}${sessionId}`);
    console.log(`Session ${sessionId} 'deleted' from simulated cloud (localStorage).`);
  } catch (error) {
    console.error(`Error 'deleting' session ${sessionId} from simulated cloud:`, error);
    throw error;
  }
};
