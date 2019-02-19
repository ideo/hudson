/* Constants */
const SUBMITTED = 'SUBMITTED';
const CLEARED = 'CLEARED';
const DRAWING = 'DRAWING';

/* Action Types */
const SUBMIT = 'hudson:prompt:canvas:submit';
const CLEAR = 'hudson:prompt:canvas:clear';
const DRAW = 'hudson:prompt:canvas:draw';

/* Action Creators */
export function submitPromptCanvas() {
  return {
    type: SUBMIT
  }
}

export function clearPromptCanvas() {
  return {
    type: CLEAR
  }
}

export function drawPromptCanvas() {
  return {
    type: DRAWING
  }
}

const initialState = {
  status: CLEARED
}

/* Reducer */
export default function reducer(state = initialState, action = {}) {
  switch(action.type) {
      case SUBMIT:
        return {
          ...state,
          status: SUBMITTED
        };
      case CLEAR: 
        return {
          ...state,
          status: CLEARED
        };
      case DRAW:
        return {
          ...state,
          status: DRAWING
        };
      default: {
        return {
          ...state
        };
      }
  }
}