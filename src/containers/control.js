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


class TableCreation extends React.Component {
  state = {
    rows: 10,
    columns: 5
  }

  changeRowCount(count) {
    this.setState({ rows: count })
  }

  changeColumnCount(count) {
    this.setState({ columns: count })
  }

  render() {
    const { rows, columns } = this.state;
    return (
      <div>
        <Table rows={rows} columns={columns} />
        <ControllerTable
          columnHandler={this.changeColumnCount.bind(this)}
          changeRowCount={this.changeRowCount.bind(this)} />
      </div>
    )
  }
}

class ControllerTable extends React.Component {

  renderTable() {
    const columnCount = this.refs.column.value;
    const rowCount = this.refs.row.value

    this.props.columnHandler(columnCount);
    this.props.changeRowCount(rowCount);
  };

  render() {
    return (
      <div>
        <label htmlFor="">
          Enter ROWS:
<input ref='row' type="text" />
        </label>
        <br />
        <label htmlFor="">
          Enter COLUMNS:
<input ref='column' type="text" />
        </label>
        <br />
        <button onClick={this.renderTable.bind(this)}>Show</button>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Control)
