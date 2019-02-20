/* Third Party */
import React, { Component } from 'react';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/* First Party */
import {
  submitPromptCanvas,
  clearPromptCanvas,
  drawPromptCanvas,
  CLEARED,
  DIRTY,
} from '../../redux/modules/prompt-canvas';
import { 
  ASYNC_PENDING,
  ASYNC_SETTLED
} from '../../services/constants';

// TODO: fetch these from the API
const instructions = 'Use the flashlight to find your instructions.';
const confirmationMessage = `
  <p>Brave words.</p>
  <p>Your secret will appear on the monitors throughout the evening.</p>
`;

class Canvas extends Component {
  handleSubmit = (e) => {
    e.preventDefault();
    const imageData = this.canvas.toDataURL('image/png');
    
    this.props.submitPromptCanvas();
  
  }

  handleClear = (e) => {
    e.preventDefault();
    this.props.clearPromptCanvas();
  }

  handleUndo = (e) => {

  }

  handleTouchDown = (e) => {

  }

  handleTouchMove = (e) => {

  }

  handleTouchUp = (e) => {

  }

  paint() {

  }




  render() {
    const { width, height } = window;
    const { canvasStatus, asyncStatus } = this.props;

    let content;

    if (asyncStatus === ASYNC_SETTLED && canvasStatus === CLEARED) {
      // Clean Canvas
      content = (
        <div className="canvas-container" id="canvas-container">
          <div className="instructions">
            {instructions}
          </div>
          <canvas ref="canvas" width={width} height={height}
                  id="canvas"></canvas>
          <div className="canvas-buttons">
              <button onClick={this.handleClear}>Clear</button>
              <button onClick={this.handleSubmit}>Submit</button>
          </div>
      </div>  
      );
    }
    
    if (asyncStatus === ASYNC_PENDING && canvasStatus === DIRTY) {
      // Saving Canvas
      content = (
        <div>
          <h1>Saving ...</h1>  
        </div>
      );
    }
    
    if (asyncStatus === ASYNC_SETTLED) {
      content = (
        <div className="confirmation-text">
          {confirmationMessage}
        </div>
      );
    }

    return content;
  }

}

const mapStateToProps = ({ promptCanvas: { status } }) => ({
  status
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    clearPromptCanvas,
    submitPromptCanvas,
    drawPromptCanvas,
    changePage: () => push('/admin')
  }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps 
)(Canvas);  