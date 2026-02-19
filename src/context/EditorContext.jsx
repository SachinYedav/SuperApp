import React, { createContext, useContext, useReducer, useRef } from 'react';

const EditorContext = createContext();

const initialState = {
  duration: 0,
  currentTime: 0,
  isPlaying: false,
  selectedLayerId: null,
  layers: [], // { id, type: 'video'|'text'|'image', start, end, properties: {x,y,scale...} }
  videoFile: null,
  videoSrc: null,
};

function editorReducer(state, action) {
  switch (action.type) {
    case 'LOAD_VIDEO':
      return { 
        ...state, 
        videoFile: action.payload.file, 
        videoSrc: action.payload.src,
        layers: [{ 
            id: 'main-video', type: 'video', start: 0, end: 0, zIndex: 0, locked: true 
        }] 
      };
    case 'SET_DURATION':
        // Update video layer duration automatically
        const updatedLayers = state.layers.map(l => 
            l.id === 'main-video' ? { ...l, end: action.payload } : l
        );
        return { ...state, duration: action.payload, layers: updatedLayers };
    case 'TOGGLE_PLAY':
      return { ...state, isPlaying: action.payload };
    case 'SET_TIME':
      return { ...state, currentTime: action.payload };
    case 'ADD_LAYER':
      return { 
          ...state, 
          layers: [...state.layers, action.payload],
          selectedLayerId: action.payload.id 
      };
    case 'UPDATE_LAYER':
      return {
        ...state,
        layers: state.layers.map(l => l.id === action.payload.id ? { ...l, ...action.payload.updates } : l)
      };
    case 'SELECT_LAYER':
      return { ...state, selectedLayerId: action.payload };
    case 'DELETE_LAYER':
      return {
        ...state,
        layers: state.layers.filter(l => l.id !== action.payload),
        selectedLayerId: null
      };
    default:
      return state;
  }
}

export function EditorProvider({ children }) {
  const [state, dispatch] = useReducer(editorReducer, initialState);
  const videoRef = useRef(null); // Direct DOM access for sync

  return (
    <EditorContext.Provider value={{ state, dispatch, videoRef }}>
      {children}
    </EditorContext.Provider>
  );
}

export function useEditor() {
  return useContext(EditorContext);
}