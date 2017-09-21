import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
// package to make meteor collections available to react
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
// import data models
import { Tasks } from '../api/task.js';

// import react components
import Task from './Task.jsx';
import AccountsUIWrapper from './AccountsUIWrapper';
 
// App component - represents the whole app
class App extends Component {

  constructor(props) {
    super(props);
 
    this.state = {
      hideCompleted: false,
    };
  }

  
  /**
   * Function to add new task
   * @param {any} event 
   * @memberof App
   */
  addTask(event) {
    event.preventDefault();
 
    // Find the text field via the React ref
    const text = ReactDOM.findDOMNode(this.refs.textTask).value.trim();
    // call the insert method in the api
    Meteor.call('tasks.insert', text);
 
    // Clear form
    ReactDOM.findDOMNode(this.refs.textTask).value = '';
  }

  toggleHideCompleted() {
    this.setState({
      hideCompleted: !this.state.hideCompleted,
    });
  }

  renderTasks() {
    let filteredTasks = this.props.tasks;
    if (this.state.hideCompleted) {
      filteredTasks = filteredTasks.filter(task => !task.checked);
    }
    return filteredTasks.map((task) => {
      const currentUserId = this.props.currentUser && this.props.currentUser._id;
      const showPrivateButton = task.owner === currentUserId;

      <Task
        key={task._id} 
        task={task}  
        showPrivateButton={showPrivateButton} 
        />
    });
  }
 
  
  render() {
    return (
      <div className="container">
        <header>
          <h1>Todo List 
            <span> You have {this.props.incompleteCount} task(s)</span>
          </h1>
        </header>
        <label className="hide-completed">
            <input
              type="checkbox"
              readOnly
              checked={this.state.hideCompleted}
              onClick={this.toggleHideCompleted.bind(this)}
            />
            Hide Completed Tasks
          </label>
        <AccountsUIWrapper />
        { this.props.currentUser ?
          <form className="new-task" onSubmit={this.addTask.bind(this)} >
            <input
              type="text"
              ref="textTask"
              placeholder="Type to add new tasks"
            />
          </form>
          :
          ''
        }
        <ul>
          {this.renderTasks()}
        </ul>
      </div>
    );
  }
}

App.propTypes = {
  tasks: PropTypes.array.isRequired,
  incompleteCount: PropTypes.number.isRequired,
  currentUser: PropTypes.object,
};

export default createContainer(() => {
  Meteor.subscribe('tasks');
  return {
    tasks: Tasks.find({}, { sort: { createdAt: -1 } }).fetch(),
    incompleteCount: Tasks.find({ checked: { $ne: true } }).count(),
    currentUser: Meteor.user(),
  };
}, App)
