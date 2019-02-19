/* Third Party */
import React, { Component } from 'react';
import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

/* First Party */
import {
  submitPromptCanvas,
  clearPromptCanvas,
  drawPromptCanvas
} from '../../redux/modules/prompt-canvas';

class Canvas extends Component {
  state = {
    submitted: false
  }

  componentDidMount() {
    console.log('Canvas Mounted!');
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({
      submitted: true
    }, () => {
      console.log(this.state);
    });
  }

  render() {
    return(
      <div>
        Hi I am canvas
        <button onClick={this.handleSubmit}></button>
      </div>
    );
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