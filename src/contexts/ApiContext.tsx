import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { ApiError } from '../types/api';

interface ApiState {
  errors: ApiError[];
  isOnline: boolean;
  pendingRequests: number;
}

type ApiAction =
  | { type: 'ADD_ERROR'; payload: ApiError }
  | { type: 'REMOVE_ERROR'; payload: string }
  | { type: 'SET_ONLINE'; payload: boolean }
  | { type: 'INCREMENT_PENDING' }
  | { type: 'DECREMENT_PENDING' };

const initialState: ApiState = {
  errors: [],
  isOnline: navigator.onLine,
  pendingRequests: 0,
};

function apiReducer(state: ApiState, action: ApiAction): ApiState {
  switch (action.type) {
    case 'ADD_ERROR':
      return {
        ...state,
        errors: [...state.errors, action.payload],
      };
    case 'REMOVE_ERROR':
      return {
        ...state,
        errors: state.errors.filter((error) => error.code !== action.payload),
      };
    case 'SET_ONLINE':
      return {
        ...state,
        isOnline: action.payload,
      };
    case 'INCREMENT_PENDING':
      return {
        ...state,
        pendingRequests: state.pendingRequests + 1,
      };
    case 'DECREMENT_PENDING':
      return {
        ...state,
        pendingRequests: Math.max(0, state.pendingRequests - 1),
      };
    default:
      return state;
  }
}

interface ApiContextType extends ApiState {
  addError: (error: ApiError) => void;
  removeError: (errorCode: string) => void;
  incrementPending: () => void;
  decrementPending: () => void;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export function ApiProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(apiReducer, initialState);

  // Set up online/offline listeners
  React.useEffect(() => {
    const handleOnline = () => dispatch({ type: 'SET_ONLINE', payload: true });
    const handleOffline = () => dispatch({ type: 'SET_ONLINE', payload: false });

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const value = {
    ...state,
    addError: (error: ApiError) => dispatch({ type: 'ADD_ERROR', payload: error }),
    removeError: (errorCode: string) => dispatch({ type: 'REMOVE_ERROR', payload: errorCode }),
    incrementPending: () => dispatch({ type: 'INCREMENT_PENDING' }),
    decrementPending: () => dispatch({ type: 'DECREMENT_PENDING' }),
  };

  return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
}

export function useApiContext() {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApiContext must be used within an ApiProvider');
  }
  return context;
}

// Example usage:
/*
function App() {
  return (
    <ApiProvider>
      <YourApp />
    </ApiProvider>
  );
}

function YourComponent() {
  const { errors, isOnline, pendingRequests } = useApiContext();
  // Use the API context values
}
*/ 