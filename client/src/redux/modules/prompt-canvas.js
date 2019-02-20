import {
  ASYNC_SETTLED,
  ASYNC_PENDING
} from '../../services/constants';

/* Constants */
export const CLEARED = 'CLEARED';
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
const SUBMITTED_PROMPT_CANVAS = 'prompt:SUBMITTED_PROMPT_CANVAS';
const SHOW_CONFIRMATION_VIEW = 'prompt:canvas:SHOW_CONFIRMATION_VIEW';
const HIDE_CONFIRMATION_VIEW = 'prompt:canvas:HIDE_CONFIRMATION_VIEW';

/* Action Creators */
export function submitPromptCanvas() {
  return (dispatch, getState) => {
    dispatch(submitPrompCanvasStart);
    window.setTimeout(() => {
      dispatch(submitPromptCanvasSuccess());
    }, 2000);
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

export function showConfirmationView(hideDelay) {
  return (dispatch) => {
    
  }
}

export function hideConfirmationView() {
  return {
    type: HIDE_CONFIRMATION_VIEW
  };
}


export function drawPromptCanvas() {
  return {
    type: DRAW_PROMPT_CANVAS
  };
}

const initialState = {
  canvasStatus: CLEARED,
  asyncStatus: ASYNC_SETTLED,
  confirmationStatus: INVISIBLE
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
      default: {
        return {
          ...state
        };
      }
  }
}