require('isomorphic-fetch');

import Layout from '../components/Layout'
import React, { Component } from 'react';
import '../style.scss';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();
const { BASE_API_URL } = publicRuntimeConfig;
const PROMPTS_API_URL = `${BASE_API_URL}/freeformprompts`;
const ENTRIES_API_URL = `${BASE_API_URL}/freeformentries`;
const UPLOAD_API_URL = `${BASE_API_URL}/upload`;

class FreeformPrompt extends Component {
  state = {
    isDrawing: false,
    hasSubmitted: false,
    canvasWidth: 0,
    canvasHeight: 0
  };

  static async getInitialProps({ query }) {
    // TODO: account for case without query ID
    let response = {};
    let notFound = false;
    try {
      response = await fetch(`${PROMPTS_API_URL}/${query.id}`).then(response => response.json());
    } catch (e) {
      console.log('woops - something went wrong', e);
      notFound = true;
    }
    
    return {
      data: response,
      notFound
    };
  }

  constructor(props) {
    super(props);
    this.saveCanvas = this.saveCanvas.bind(this);
    this.clearCanvas = this.clearCanvas.bind(this);
    this.resetTempCanvas = this.resetTempCanvas.bind(this);
  }
  
  componentDidMount() {
    this.setState({
      canvasHeight: window.innerHeight,
      canvasWidth: window.innerWidth
    }, () => {
      this.resetTempCanvas();
      this.clearCanvas();
    })
  }

  componentWillUnMount() {
    canvas.removeEventListener("mousedown", this.onTouchDown)
    canvas.removeEventListener("mousemove", this.onTouchMove)
    canvas.removeEvenmonitors("mouseup", this.onTouchUp)
  }

  clearCanvas() {
    //this.ctxt.clearRect(0, 0, this.canvas.width, this.canvas.height)
    this.ctxt.fillStyle = '#ffffff';
    this.ctxt.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  canvasToBlob = (dataURI) => {
    // convert base64/URLEncoded data component to raw binary data held in a string
    let byteString;
    if (dataURI.split(',')[0].indexOf('base64') >= 0) {
        byteString = atob(dataURI.split(',')[1]);
    } else {
        byteString = unescape(dataURI.split(',')[1]);
    }
    // separate out the mime component
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to a typed array
    const ia = new Uint8Array(byteString.length);
    for (let i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }
    return new Blob([ia], {type:mimeString});
  }

  saveCanvas(){
    const imageData = this.canvas.toDataURL("image/png");
    const blob = this.canvasToBlob(imageData);
    const { 
      id: promptId,
      thankyoumessagetimeout
    } = this.props.data;
    this.setState({ hasSubmitted: true })
    const tempCanvas = document.getElementById('temp-canvas');
    const container = document.getElementById('canvas-container');
    container.removeChild(tempCanvas);

    fetch(ENTRIES_API_URL, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        geolocation: JSON.stringify({lat: 2222, lon: 2233 }),
        freeformprompt: promptId
      })
    }).then(response => {
      return response.json();
    }).then(response => {
      // Handle success.
      console.log(
        'Well done, your post has been successfully created: ',
        response
      );
      return {
        entryId: response.id
      }
    }).then(({ entryId }) => {
      const formData = new FormData();
      const filename = `freeform-entry-${new Date().getTime()}.png`;
      formData.append('path', 'uploads/freeformentries');
      formData.append('refId', entryId);
      formData.append('field', 'response');
      formData.append('ref', 'freeformentry');
      formData.append('files', blob, filename);        
      // Upload the writing
      return fetch(UPLOAD_API_URL, {
        method: 'post',
        body: formData
      });
    }).then(response => {
      if (response.ok) {
        console.log('Woot! Saved Image.');
        window.setTimeout(() => {
          this.setState({
            hasSubmitted: false
          }, () => {
            this.resetTempCanvas();
            this.clearCanvas();
          });
        }, thankyoumessagetimeout * 1000);
      } else {
        console.log('Failed to Save the image ', response);
        throw new Error(`Failed to save the image with the following HTTP Code ${response.status}`);
      }
    }).catch(error => {
      // Handle error.
      console.log('An error occurred:', error);
    });
  }

  onTouchDown = (e) => {
    e.preventDefault();
    this.setState({
      isDrawing: true
    });
    let x = (e.type === 'touchstart') ? e.pageX : e.clientX
    let y = (e.type === 'touchstart') ? e.pageY : e.clientY

    this.mouse.x = x
    this.mouse.y = y
    this.points.push({ x: x, y: y })

    this.paint()
  }

  paint() {
    var mouse = this.mouse, points = this.points, tempCtxt = this.tempCtxt

    // Saving all the points in an array
    points.push({ x: mouse.x, y: mouse.y });
    if (points.length < 3) {
      var b = points[0];
      tempCtxt.beginPath();
      tempCtxt.arc(b.x, b.y, tempCtxt.lineWidth / 2, 0, Math.PI * 2, true);
      tempCtxt.fill();
      tempCtxt.closePath();
      return;
    }

    // Tmp canvas is always cleared up before drawing.
    tempCtxt.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height)
    tempCtxt.beginPath();
    tempCtxt.moveTo(points[0].x, points[0].y)

    for (var i = 1; i < points.length - 2; i++) {
      var c = (points[i].x + points[i + 1].x) / 2
      var d = (points[i].y + points[i + 1].y) / 2

      tempCtxt.quadraticCurveTo(points[i].x, points[i].y, c, d)
    }

    // For the last 2 points
    tempCtxt.quadraticCurveTo(
      points[i].x,
      points[i].y,
      points[i + 1].x,
      points[i + 1].y
    )

    tempCtxt.stroke()
  }

  onTouchMove = (e) => {
    e.preventDefault()
    if (this.state.isDrawing) {
      let x = (e.type === 'touchmove') ? e.pageX : e.clientX
      let y = (e.type === 'touchmove') ? e.pageY : e.clientY

      this.mouse.x = x
      this.mouse.y = y
      this.paint()
    }
  }

  undo() {
    this.ctxt.restore();
    this.ctxt.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctxt.stroke();
  }

  onTouchUp = () => {
    this.setState({
      isDrawing: false
    });
    this.ctxt.drawImage(this.tempCanvas, 0, 0);

    // Clearing temp canvas
    this.tempCtxt.clearRect(0, 0, this.tempCanvas.width, this.tempCanvas.height);

    // Emptying up Pencil Points
    this.points = [];
  }

  createTempCanvas() {
    var tempCanvas = document.createElement('canvas')
    tempCanvas.id = "temp-canvas"
    tempCanvas.width = this.state.canvasWidth
    tempCanvas.height = this.state.canvasHeight
    var container = document.getElementById('canvas-container')
    container.appendChild(tempCanvas)
    return tempCanvas
  }

  resetTempCanvas() {
    this.canvas = this.refs.canvas;
    this.mouse = {x: 0, y: 0};
    this.lastMouse = {x: 0, y: 0};
    this.points = [];
    this.tempCanvas = this.createTempCanvas();

    this.tempCanvas.addEventListener('mousedown', this.onTouchDown);
    this.tempCanvas.addEventListener('mousemove', this.onTouchMove);
    this.tempCanvas.addEventListener('mouseup', this.onTouchUp);

    this.tempCanvas.addEventListener('touchstart', this.onTouchDown);
    this.tempCanvas.addEventListener('touchmove', this.onTouchMove);
    this.tempCanvas.addEventListener('touchend', this.onTouchUp);

    this.tempCtxt = this.tempCanvas.getContext('2d');
    this.tempCtxt.strokeStyle = this.props.data.linecolor || '#000000';
    this.tempCtxt.lineWidth = this.props.data.linethickness || 2;
    this.tempCtxt.lineJoin= 'round';
    this.tempCtxt.lineCap = 'round';
    this.ctxt = canvas.getContext('2d');

    var container = document.getElementById('canvas-container');
    container.appendChild(this.tempCanvas);
  }



  render() {
    const { notFound, data: { thankyoumessage } } = this.props
    const { hasSubmitted, canvasWidth, canvasHeight } = this.state
    return (
      <Layout>
        {notFound && <h1>Woops. Prompt does not exist.</h1>}
        {
          hasSubmitted ?
          <div className="freeform-thankyou-message-container">
            <p className="freeform-thankyou-message">
              { thankyoumessage }
            </p>
          </div> :
          <div className="canvas-container" id="canvas-container">
              <div className="instructions">
                Use the flashlight to find your instructions.
              </div>
              <canvas 
                ref="canvas" 
                width={canvasWidth} 
                height={canvasHeight}
                id="canvas">
              </canvas>
              <div className="freeform-entry-action-buttons-container">
                  <button className="freeform-entry-action-button" onClick={this.clearCanvas}>clear</button>
                  <button className="freeform-entry-action-button" onClick={this.saveCanvas}>submit</button>
              </div>
          </div>
        }
      </Layout>
    );
  }
}

export default FreeformPrompt;