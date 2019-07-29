import React from 'react'
import { NavLink, Route, Switch } from 'react-router-dom'
import AddAdmin from '../../containers/Manage/Admins/AddAdmin'
import CheckAdmin from '../../containers/Manage/Admins/CheckAdmin'
import RemoveAdmin from '../../containers/Manage/Admins/RemoveAdmin'
import styles from './Admins.module.scss'

const Admins = () => (
  <div>
    <div className={styles.header}>
      <NavLink to="/manage/admins">
        {'Check Admin'}
      </NavLink>
      <NavLink to="/manage/admins/add">
        {'Add Admin'}
      </NavLink>
      <NavLink to="/manage/admins/remove">
        {'Remove Admin'}
      </NavLink>
    </div>
    <Switch>
      <Route exact path="/manage/admins" component={CheckAdmin} />
      <Route exact path="/manage/admins/add" component={AddAdmin} />
      <Route exact path="/manage/admins/remove" component={RemoveAdmin} />
    </Switch>
  </div>
)

export default Admins
