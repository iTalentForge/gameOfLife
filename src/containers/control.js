import React, { Component } from 'react';
import { connect } from 'react-redux';
import { makeRandomGrid, tick, startPlaying, stopPlaying, clear } from '../actions/';

import Button from '../components/button';

class Control extends Component {
  componentDidMount() {
    this.props.random();
    this.togglePlay();
  }
  render() {
    return (
      <div className="controls">
        <div className="buttons">
          <Button
            handleClick={() => this.props.random()}
            title={'Random'}
            icon={'fa fa-random'}
          />
          <Button
            handleClick={() => this.clear()}
            title={'Clear'}
            icon={'fa fa-undo'}
          />
          <div className="button-group">
            <Button
              icon={this.props.playState.isRunning ? 'fa fa-pause' : 'fa fa-play'}
              handleClick={() => this.togglePlay()}
            />
            <Button
              handleClick={() => this.props.tick()}
              icon={'fa fa-step-forward'}
            />
            <TableCreation />
          </div>
        </div>
      </div>
    );
  }
  togglePlay() {
    if (this.props.playState.isRunning) {
      clearInterval(this.props.playState.timerId);
      this.props.stopPlaying();
    } else {
      let interval = setInterval(this.props.tick, 100);
      this.props.startPlaying(interval);
    }
  }
  clear() {
    if (this.props.playState.isRunning) {
      clearInterval(this.props.playState.timerId);
      this.props.stopPlaying();
    }
    this.props.clear();
  }
}


const mapStateToProps = ({ playState }) => {
  return { playState };
}

const mapDispatchToProps = (dispatch) => {
  return {
    random: () => dispatch(makeRandomGrid()),
    tick: () => dispatch(tick()),
    startPlaying: (timerId) => dispatch(startPlaying(timerId)),
    stopPlaying: () => dispatch(stopPlaying()),
    clear: () => dispatch(clear())
  };
}




import React from 'react';


const Table = ({ rows, columns }) => {
  const rowsHtml = [];

  for (let i = 0; i < rows; i++) {
    rowsHtml.push(<Row columns={columns} key={i} />)
  }


  return (
    <table>
      {rowsHtml}
    </table>
  )
}

const Row = ({ columns }) => {
  const columnsHtml = [];

  for (let i = 0; i < columns; i++) {
    columnsHtml.push(<Column key={i} />)
  }
  return (
    <tr>
      {columnsHtml}
    </tr>
  )
}

const Column = () => <td />


export default class extends React.Component {
  state = {
    rows: 10,
    columns: 5
  }

  changeRowCount = (count) => {
    this.setState({ rows: count })
  }

  changeColumnCount = (count) => {
    this.setState({ columns: count })
  }

  render() {
    const { rows, columns } = this.state;
    return (
      <React.Fragment>
        <Table rows={rows} columns={columns} />
        <ControllerTable
          columnHandler={this.changeColumnCount}
          changeRowCount={this.changeRowCount} />
      </React.Fragment>
    )
  }
}

const ControllerTable = ({ columnHandler, changeRowCount }) => {
  const inputColumn = React.createRef();
  const inputRow = React.createRef();

  const renderTable = () => {
    const columnCount = inputColumn.current.value;
    const rowCount = inputRow.current.value;

    columnHandler(columnCount);
    changeRowCount(rowCount);
  }
  return (
    <>
      <label htmlFor="">
        Enter ROWS:
<input ref={inputRow} type="text" />
      </label>
      <br />
      <label htmlFor="">
        Enter COLUMNS:
<input ref={inputColumn} type="text" />
      </label>
      <br />
      <button onClick={renderTable}>Show</button>
    </>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(Control)
