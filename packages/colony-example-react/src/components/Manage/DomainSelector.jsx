import React from 'react'
import styles from './DomainSelector.module.scss'

const DomainSelector = ({ handleChange, domainId, domains, slice }) => (
  <div className={styles.field}>
    <label htmlFor="domainId">
      {'Domain:'}
    </label>
    <select id="domainId" onChange={handleChange} value={domainId}>
      <option value={0}>
        {'select domain...'}
      </option>
      {domains ? domains.slice(slice).map(domain => (
        <option key={domain.id} value={domain.id}>
          {domain.id}
        </option>
      )) : (
        <option value={null}>
          {'loading...'}
        </option>
      )}
    </select>
  </div>
)

export default DomainSelector
