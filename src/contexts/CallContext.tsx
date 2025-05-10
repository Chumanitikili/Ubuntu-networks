import React, { createContext, useContext, useReducer, useEffect } from 'react';

interface Call {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company: string;
  type: 'inbound' | 'outbound';
  status: 'active' | 'completed' | 'missed' | 'scheduled';
  startTime: Date;
  endTime?: Date;
  notes: string[];
  accountType: 'B2B' | 'B2C';
  priority: 'low' | 'medium' | 'high';
}

interface CallState {
  activeCalls: Call[];
  callHistory: Call[];
  scheduledCalls: Call[];
  currentCall: Call | null;
}

type CallAction =
  | { type: 'START_CALL'; payload: Call }
  | { type: 'END_CALL'; payload: string }
  | { type: 'ADD_NOTE'; payload: { callId: string; note: string } }
  | { type: 'SCHEDULE_CALL'; payload: Call }
  | { type: 'SET_CURRENT_CALL'; payload: Call | null };

const initialState: CallState = {
  activeCalls: [],
  callHistory: [],
  scheduledCalls: [],
  currentCall: null,
};

const CallContext = createContext<{
  state: CallState;
  dispatch: React.Dispatch<CallAction>;
} | null>(null);

function callReducer(state: CallState, action: CallAction): CallState {
  switch (action.type) {
    case 'START_CALL':
      return {
        ...state,
        activeCalls: [...state.activeCalls, action.payload],
        currentCall: action.payload,
      };
    case 'END_CALL':
      const endedCall = state.activeCalls.find(call => call.id === action.payload);
      if (!endedCall) return state;
      
      const updatedCall = {
        ...endedCall,
        status: 'completed' as const,
        endTime: new Date(),
      };

      return {
        ...state,
        activeCalls: state.activeCalls.filter(call => call.id !== action.payload),
        callHistory: [...state.callHistory, updatedCall],
        currentCall: null,
      };
    case 'ADD_NOTE':
      return {
        ...state,
        activeCalls: state.activeCalls.map(call =>
          call.id === action.payload.callId
            ? { ...call, notes: [...call.notes, action.payload.note] }
            : call
        ),
        callHistory: state.callHistory.map(call =>
          call.id === action.payload.callId
            ? { ...call, notes: [...call.notes, action.payload.note] }
            : call
        ),
      };
    case 'SCHEDULE_CALL':
      return {
        ...state,
        scheduledCalls: [...state.scheduledCalls, action.payload],
      };
    case 'SET_CURRENT_CALL':
      return {
        ...state,
        currentCall: action.payload,
      };
    default:
      return state;
  }
}

export function CallProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(callReducer, initialState);

  // Simulate incoming calls
  useEffect(() => {
    const incomingCallInterval = setInterval(() => {
      const random = Math.random();
      if (random < 0.1 && state.activeCalls.length < 3) { // 10% chance of incoming call
        const newCall: Call = {
          id: Math.random().toString(36).substr(2, 9),
          customerName: `Customer ${Math.floor(Math.random() * 100)}`,
          customerEmail: `customer${Math.floor(Math.random() * 100)}@example.com`,
          customerPhone: `+1 (555) ${Math.floor(Math.random() * 900 + 100)}-${Math.floor(Math.random() * 9000 + 1000)}`,
          company: `Company ${Math.floor(Math.random() * 100)}`,
          type: 'inbound',
          status: 'active',
          startTime: new Date(),
          notes: [],
          accountType: Math.random() > 0.5 ? 'B2B' : 'B2C',
          priority: Math.random() > 0.7 ? 'high' : Math.random() > 0.4 ? 'medium' : 'low',
        };
        dispatch({ type: 'START_CALL', payload: newCall });
      }
    }, 10000); // Check every 10 seconds

    return () => clearInterval(incomingCallInterval);
  }, [state.activeCalls.length]);

  return (
    <CallContext.Provider value={{ state, dispatch }}>
      {children}
    </CallContext.Provider>
  );
}

export function useCall() {
  const context = useContext(CallContext);
  if (!context) {
    throw new Error('useCall must be used within a CallProvider');
  }
  return context;
}
