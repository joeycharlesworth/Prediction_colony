import React, { Component } from 'react'
import { connect } from 'react-redux'
import formatDate from '../../../../helpers/formatDate'
import * as taskActions from '../../../../actions/taskActions'
import SetDetails from '../../../../components/Manage/Tasks/EditTask/SetDetails'

class SetDetailsContainer extends Component {

  constructor(props) {
    super(props)
    this.state = {
      task: {
        domainId: props.task.domainId,
        dueDate: formatDate(props.task.dueDate),
        skillId: props.task.skillId,
        specification: {
          description: props.task.specification.description,
          title: props.task.specification.title,
        },
      },
    }
    this.canSetDetails = this.canSetDetails.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.getTaskSuccess && this.props.getTaskSuccess) {
      this.setState({
        task: {
          domainId: this.props.task.domainId,
          dueDate: formatDate(this.props.task.dueDate),
          skillId: this.props.task.skillId,
          specification: {
            description: this.props.task.specification.description,
            title: this.props.task.specification.title,
          },
        },
      })
    }
  }

  componentWillUnmount() {
    this.props.resetActions()
  }

  canSetDetails() {
    const completionDate = this.props.task.completionDate
    return completionDate === null
  }

  handleChange(event) {
    let task = this.state.task
    switch (event.target.id) {
      case 'specification-description':
      case 'specification-title':
        task.specification[event.target.id.substring(14)] = event.target.value
        break
      case 'domainId':
        task[event.target.id] = Number(event.target.value)
        break
      case 'skillId':
        task[event.target.id] = Number(event.target.value)
        break
      default:
        task[event.target.id] = event.target.value
        break
    }
    this.setState({ task })
  }

  handleClick() {

    // set prev and next
    const prev = this.props.task
    const next = this.state.task

    // declare task parameters
    let domainId, dueDate, skillId, specification

    // set domainId if domainId has changed
    if (prev.domainId !== next.domainId) {
      domainId = next.domainId
    }

    // set dueDate if dueDate has changed
    if (formatDate(prev.dueDate) !== next.dueDate) {
      dueDate = next.dueDate
    }

    // set skillId if skillId has changed
    if (prev.skillId !== next.skillId) {
      skillId = next.skillId
    }

    // set specification if specification has changed
    if (
      prev.specification.description !== next.specification.description ||
      prev.specification.title !== next.specification.title
    ) {
      specification = next.specification
    }

    // set details
    const details = {
      domainId,
      dueDate,
      skillId,
      specification,
    }

    // update task
    this.props.setTaskDetails(this.props.colonyClient, prev.id, details)

  }

  render() {
    return (
      <SetDetails
        canSetDetails={this.canSetDetails}
        handleChange={this.handleChange}
        handleClick={this.handleClick}
        setTaskDetailsError={this.props.setTaskDetailsError}
        setTaskDetailsLoading={this.props.setTaskDetailsLoading}
        setTaskDetailsSuccess={this.props.setTaskDetailsSuccess}
        task={this.state.task}
      />
    )
  }

}

const mapStateToProps = state => ({
  colonyClient: state.colony.colonyClient,
  getTaskError: state.task.getTaskError,
  getTaskLoading: state.task.getTaskLoading,
  getTaskSuccess: state.task.getTaskSuccess,
  setTaskDetailsError: state.task.setTaskDetailsError,
  setTaskDetailsLoading: state.task.setTaskDetailsLoading,
  setTaskDetailsSuccess: state.task.setTaskDetailsSuccess,
  task: state.task.task,
})

const mapDispatchToProps = dispatch => ({
  resetActions() {
    dispatch(taskActions.setTaskDetailsError(null))
    dispatch(taskActions.setTaskDetailsSuccess(false))
  },
  setTaskDetails(colonyClient, taskId, details) {
    dispatch(taskActions.setTaskDetails(colonyClient, taskId, details))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(SetDetailsContainer)
