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
  setStatusDrawing,
  setStatusIdle,
  updatePenPosition,
  resetPenPosition,
  addDrawingPoint,
  clearDrawingPoints,
  CLEARED,
  DIRTY,
  VISIBLE,
  INVISIBLE,
  DRAWING,
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
  componentDidMount() {
    this.resetTempCanvas();
  }

  componentWillUnmount() {
    this.canvas.removeEventListener('mousedown', this.handleTouchDown);
    this.canvas.removeEventListener('mousemove', this.handleTouchMove);
    this.canvas.removeEventListener('mouseup', this.handleTouchUp);
  }

  createTempCanvas() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.id = 'temp-canvas';
    tempCanvas.width = this.refs.canvas.width;
    tempCanvas.height = this.refs.canvas.height;
    const container = document.getElementById('canvas-container');
    container.appendChild(tempCanvas);
    return tempCanvas;
}

  handleSubmit = (e) => {
    e.preventDefault();
    const imageData = this.canvas.toDataURL('image/png');
    this.props.submitPromptCanvas();
    const tempCanvas = document.getElementById('temp-canvas');
    const container = document.getElementById('canvas-container');
    container.removeChild(tempCanvas)
    this.resetTempCanvas();
  }

  handleClear = (e) => {
    e.preventDefault();
    this.props.clearPromptCanvas();
  }

  handleUndo = (e) => {
    e.preventDefault();
    this.ctx.restore();
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.stroke();
  }

  handleTouchDown = (e) => {
    console.log('-------> touch down');
    e.preventDefault()
    this.props.setStatusDrawing();

    let x = (e.type === 'touchstart') ? e.pageX : e.clientX
    let y = (e.type === 'touchstart') ? e.pageY : e.clientY

    this.props.updatePenPosition({x, y});
    this.props.addDrawingPoint({x, y});
    
    this.paint();
  }

  handleTouchMove = (e) => {
    e.preventDefault();
    console.log('touchmove')
    if (this.props.canvasStatus === DRAWING) {
        let x = (e.type === 'touchmove') ? e.pageX : e.clientX
        let y = (e.type === 'touchmove') ? e.pageY : e.clientY
        this.props.updatePenPosition({x, y});
        this.paint();
    }
  }

  handleTouchUp = (e) => {
    this.props.setStatusIdle();
     
		this.ctx.drawImage(this.tempCanvas, 0, 0);

		// Clearing temp canvas
		this.tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
		
		// Emptying up Pencil Points
		this.props.clearDrawingPoints();
  }

  paint() {
    const { points, penPosition } = this.props;
    const tempCtx = this.tempCtx;
    
    this.props.addDrawingPoint(penPosition);

    if (points.length < 3) {
      let b = points[0];
      tempCtx.beginPath();
      tempCtx.arc(b.x, b.y, tempCtx.lineWidth / 2, 0, Math.PI * 2, !0);
      tempCtx.fill();
      tempCtx.closePath();
      return;
    }
      
    // Tmp canvas is always cleared up before drawing.
    tempCtx.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);
    tempCtx.beginPath();
    tempCtx.moveTo(points[0].x, points[0].y)
      
    for (var i = 1; i < points.length - 2; i++) {
      let c = (points[i].x + points[i + 1].x) / 2;
      let d = (points[i].y + points[i + 1].y) / 2;
      tempCtx.quadraticCurveTo(points[i].x, points[i].y, c, d)
    }
    tempCtx.quadraticCurveTo(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y
    )
    tempCtx.stroke();
  }    

  resetTempCanvas() {
    this.canvas = this.refs.canvas
    this.props.resetPenPosition();
    this.props.clearDrawingPoints();
    this.tempCanvas = this.createTempCanvas();

    this.tempCanvas.addEventListener('mousedown', this.handleTouchDown);
    this.tempCanvas.addEventListener('mousemove', this.handleTouchMove);
    this.tempCanvas.addEventListener('mouseup', this.handleTouchUp);

    this.tempCanvas.addEventListener('touchstart', this.handleTouchDown);
    this.tempCanvas.addEventListener('touchmove', this.handleTouchMove);
    this.tempCanvas.addEventListener('touchend', this.handleTouchUp);

    this.tempCtx = this.tempCanvas.getContext('2d');
    this.tempCtx.strokeStyle = this.props.strokeColor;
    this.tempCtx.lineWidth = this.props.strokeWidth;
    this.tempCtx.lineJoin= 'round';
    this.tempCtx.lineCap = 'round';
    this.ctx = this.canvas.getContext('2d');

    var container = document.getElementById('canvas-container');
    container.appendChild(this.tempCanvas)
  }

  render() {
    const { innerWidth: width, innerHeight: height } = window;
    const { asyncStatus, confirmationStatus } = this.props;

    let content;
    if (asyncStatus === ASYNC_SETTLED && confirmationStatus === VISIBLE) {
      // Show confirmation message
      content = (
        <div className="confirmation-text">
          <div dangerouslySetInnerHTML={{
            __html: confirmationMessage
          }}>
          </div>
        </div>
      );
    } else if (asyncStatus === ASYNC_SETTLED && confirmationStatus === INVISIBLE) {
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
    } else if (asyncStatus === ASYNC_PENDING) {
      // Saving Canvas
      content = (
        <h1>Saving ...</h1>  
      );
    }
    return (<div>{content}</div>);
  }

}

const mapStateToProps = ({ promptCanvas: { 
  canvasStatus, asyncStatus, confirmationStatus, penPosition, points, strokeColor, strokeWidth
} }) => ({
  canvasStatus,
  asyncStatus,
  confirmationStatus,
  penPosition,
  points,
  strokeColor,
  strokeWidth
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({
    clearPromptCanvas,
    submitPromptCanvas,
    drawPromptCanvas,
    setStatusDrawing,
    setStatusIdle,
    updatePenPosition,
    addDrawingPoint,
    clearDrawingPoints, 
    resetPenPosition,
    changePage: () => push('/admin')
  }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps 
)(Canvas);  