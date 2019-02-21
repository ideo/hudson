import {
  ASYNC_SETTLED,
  ASYNC_PENDING
} from '../../services/constants';

/* Constants */
export const CLEARED = 'CLEARED';
export const IDLE = 'IDLE';
export const DRAWING = 'DRAWING';
export const DIRTY = 'DIRTY';
export const SUBMITTED = 'SUBMITTED';
export const VISIBLE = 'VISIBLE';
export const INVISIBLE = 'INVISIBLE';

/* Action Types */
const SUBMIT_PROMPT_CANVAS_START = 'prompt:canvas:SUBMIT_PROMPT_CANVAS_START';
const SUBMIT_PROMPT_CANVAS_FAIL = 'prompt:canvas:SUBMIT_PROMPT_CANVAS_FAIL';
const SUBMIT_PROMPT_CANVAS_SUCCESS = 'prompt:canvas:SUBMIT_PROMPT_CANVAS_SUCCESS';
const CLEAR_PROMPT_CANVAS = 'prompt:canvas:CLEAR_PROMPT_CANVAS';
const DRAW_PROMPT_CANVAS = 'prompt:canvas:DRAW_PROMPT_CANVAS';
const SHOW_CONFIRMATION_VIEW = 'prompt:canvas:SHOW_CONFIRMATION_VIEW';
const HIDE_CONFIRMATION_VIEW = 'prompt:canvas:HIDE_CONFIRMATION_VIEW';
const SET_STATUS_DRAWING = 'prompt:canvas:SET_STATUS_DRAWING';
const SET_STATUS_IDLE = 'prompt:canvas:SET_STATUS_IDLE';
const UPDATE_PEN_POSITION = 'prompt:canvas:UPDATE_PEN_POSITION';
const ADD_DRAWING_POINT = 'prompt:canvas:ADD_DRAWING_POINT';
const CLEAR_DRAWING_POINTS = 'prompt:canvas:CLEAR_DRAWING_POINTS';
const SET_DRAWING_COLOR = 'prompt:canvas:SET_DRAWING_COLOR';
const SET_STROKE_WIDTH = 'prompt:canvas:SET_STROKE_WIDTH';

// TODO: this should come from the API
const hideConfirmationViewDelayInMs = 2000; 

/* Action Creators */
export function submitPromptCanvas() {
  return (dispatch, getState) => {
    dispatch(submitPrompCanvasStart());
    window.setTimeout(() => {
      dispatch(submitPromptCanvasSuccess());
      dispatch(flashConfirmationView(hideConfirmationViewDelayInMs));
    }, 2000);
  };
}

export function setDrawingColor(color) {
  return {
    type: SET_DRAWING_COLOR,
    paylad: color
  };
}

export function updatePenPosition(newPosition) {
  return {
    type: UPDATE_PEN_POSITION,
    payload: newPosition
  };
}

export function resetPenPosition() {
  return {
    type: UPDATE_PEN_POSITION,
    paylad: {x: 0, y: 0}
  };
}

export function addDrawingPoint(point) {
  return {
    type: ADD_DRAWING_POINT,
    payload: point
  };
}

export function clearDrawingPoints() {
  return {
    type: CLEAR_DRAWING_POINTS
  };
}

export function submitPrompCanvasStart() {
  return {
    type: SUBMIT_PROMPT_CANVAS_START
  }
}

export function submitPromptCanvasSuccess() {
  return {
    type: SUBMIT_PROMPT_CANVAS_SUCCESS
  };
}

export function submitPromptCanvasFail() {
  return {
    type: SUBMIT_PROMPT_CANVAS_FAIL
  };
}

export function clearPromptCanvas() {
  return {
    type: CLEAR_PROMPT_CANVAS
  };
}

export function showConfirmationView() {
  return {
    type: SHOW_CONFIRMATION_VIEW
  };
}

export function hideConfirmationView() {
  return {
    type: HIDE_CONFIRMATION_VIEW
  };
}

export function setStatusDrawing() {
  return {
    type: SET_STATUS_DRAWING
  };
}

export function setStatusIdle() {
  return {
    type: SET_STATUS_IDLE
  }
};

export function flashConfirmationView(hideDelayInMs) {
  return (dispatch) => {
    dispatch(showConfirmationView());
    window.setTimeout(() => {
      dispatch(hideConfirmationView());
    }, hideDelayInMs);
  }
}

export function setstrokeWidth(strokeWidth) {
  return {
    type: SET_STROKE_WIDTH,
    payload: strokeWidth
  }
}


export function drawPromptCanvas() {
  return {
    type: DRAW_PROMPT_CANVAS
  };
}

const initialState = {
  canvasStatus: CLEARED,
  asyncStatus: ASYNC_SETTLED,
  confirmationStatus: INVISIBLE,
  penPosition: {
    x: 0,
    y: 0
  },
  points: [],
  strokeColor: '#000000',
  strokeWidth: 10
};

/* Reducer */
export default function reducer(state = initialState, action = {}) {
  switch(action.type) {
      case SUBMIT_PROMPT_CANVAS_START:
        return {
          ...state,
          asyncStatus: ASYNC_PENDING
        };
      case SUBMIT_PROMPT_CANVAS_SUCCESS: 
        return {
          ...state,
          asyncStatus: ASYNC_SETTLED
        };
      case SUBMIT_PROMPT_CANVAS_FAIL:
        return {
          ...state,
          asyncStatus: ASYNC_SETTLED
        };
      case CLEAR_PROMPT_CANVAS:
        return {
          ...state,
          canvasStatus: CLEARED
        };
      case SHOW_CONFIRMATION_VIEW:
        return {
          ...state,
          confirmationStatus: VISIBLE
        };
      case HIDE_CONFIRMATION_VIEW:
        return {
          ...state,
          confirmationStatus: INVISIBLE
        }
      case DRAW_PROMPT_CANVAS:
        return {
          ...state,
          canvasStatus: DIRTY
        };
      case SET_STATUS_DRAWING:
        return {
          ...state,
          canvasStatus: DRAWING
        };
      case SET_STATUS_IDLE:
        return {
          ...state,
          canvasStatus: IDLE
        };
      case UPDATE_PEN_POSITION:
        return {
          ...state,
          penPosition: action.payload
        };
      case ADD_DRAWING_POINT:
        return {
          ...state,
          points: [...state.points, action.payload]
        };
      case CLEAR_DRAWING_POINTS:
        return {
          ...state,
          points: []
        };
      case SET_DRAWING_COLOR:
        return {
          ...state,
          strokeColor: action.payload
        };
      case SET_STROKE_WIDTH:
        return {
          ...state,
          strokeWidth: action.payload
        }
      default: {
        return {
          ...state
        };
      }
  }
}