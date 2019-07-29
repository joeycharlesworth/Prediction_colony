import React from 'react'
import { NavLink, Route, Switch } from 'react-router-dom'
import AddTask from '../../containers/Manage/Tasks/AddTask'
import ClaimPayout from '../../containers/Manage/Tasks/ClaimPayout'
import EditTask from '../../containers/Manage/Tasks/EditTask'
import FundTask from '../../containers/Manage/Tasks/FundTask'
import RevealRating from '../../containers/Manage/Tasks/RevealRating'
import SubmitRating from '../../containers/Manage/Tasks/SubmitRating'
import SubmitWork from '../../containers/Manage/Tasks/SubmitWork'
import ViewTask from '../../containers/Manage/Tasks/ViewTask'
import ViewTasks from '../../containers/Manage/Tasks/ViewTasks'
import styles from './Tasks.module.scss'

const Tasks = () => (
  <div>
    <div className={styles.header}>
      <NavLink to="/manage/tasks">
        {'View Tasks'}
      </NavLink>
      <NavLink to="/manage/tasks/new">
        {'Add Task'}
      </NavLink>
      <NavLink to="/manage/tasks/fund">
        {'Fund Task'}
      </NavLink>
    </div>
    <Switch>
      <Route exact path="/manage/tasks" component={ViewTasks} />
      <Route exact path="/manage/tasks/new" component={AddTask} />
      <Route exact path="/manage/tasks/fund" component={FundTask} />
      <Route exact path="/manage/tasks/:id" component={ViewTask} />
      <Route exact path="/manage/tasks/claim/:id" component={ClaimPayout} />
      <Route exact path="/manage/tasks/edit/:id" component={EditTask} />
      <Route exact path="/manage/tasks/rate/:id" component={SubmitRating} />
      <Route exact path="/manage/tasks/reveal/:id" component={RevealRating} />
      <Route exact path="/manage/tasks/submit/:id" component={SubmitWork} />
    </Switch>
  </div>
)

export default Tasks
