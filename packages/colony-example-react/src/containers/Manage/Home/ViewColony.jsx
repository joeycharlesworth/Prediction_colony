import React, { Component } from 'react'
import { connect } from 'react-redux'
import * as domainActions from '../../../actions/domainActions'
import ViewColony from '../../../components/Manage/Home/ViewColony'

class ViewColonyContainer extends Component {

  componentDidMount() {
    if (this.props.domains === null) {
      this.props.getDomains(this.props.colonyClient)
    }
  }

  componentDidUpdate() {
    if (this.props.domains === null && !this.props.getDomainsLoading) {
      this.props.getDomains(this.props.colonyClient)
    }
  }

  componentWillUnmount() {
    this.props.resetActions()
  }

  render() {
    return (
      <ViewColony
        address={this.props.colonyClient.contract.address}
        domains={this.props.domains}
        getDomainsError={this.props.getDomainsError}
        getDomainsLoading={this.props.getDomainsLoading}
        getDomainsSuccess={this.props.getDomainsSuccess}
      />
    )
  }

}

const mapStateToProps = state => ({
  colonyClient: state.colony.colonyClient,
  domains: state.domain.domains,
  getDomainsError: state.domain.getDomainsError,
  getDomainsLoading: state.domain.getDomainsLoading,
  getDomainsSuccess: state.domain.getDomainsSuccess,
})

const mapDispatchToProps = dispatch => ({
  getDomains(colonyClient) {
    dispatch(domainActions.getDomains(colonyClient))
  },
  resetActions() {
    dispatch(domainActions.getDomainsError(null))
    dispatch(domainActions.getDomainsSuccess(false))
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(ViewColonyContainer)
