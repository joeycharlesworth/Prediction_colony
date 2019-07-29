import React from 'react'
import DomainSelector from '../../../containers/Manage/DomainSelector'
import styles from './FundDomain.module.scss'

const FundDomain = ({
  funding,
  fundDomainError,
  fundDomainLoading,
  fundDomainSuccess,
  handleClick,
  handleChange,
}) => (
  <div className={styles.container}>
    <h2>{'Fund Domain'}</h2>
    <DomainSelector
      handleChange={handleChange}
      domainId={funding.domainId}
      slice={1}
    />
    <div className={styles.field}>
      <label htmlFor="amount">
        {'Amount:'}
      </label>
      <input
        id="amount"
        onChange={handleChange}
        type="number"
        value={funding.amount}
      />
    </div>
    <div className={styles.buttons}>
      <button onClick={handleClick}>
        {'Fund Domain'}
      </button>
    </div>
    {fundDomainError &&
      <div className={styles.message}>
        <span className={styles.error}>
          {fundDomainError}
        </span>
      </div>
    }
    {fundDomainLoading &&
      <div className={styles.message}>
        <span>
          {'loading...'}
        </span>
      </div>
    }
    {fundDomainSuccess &&
      <div className={styles.message}>
        {'success'}
      </div>
    }
  </div>
)

export default FundDomain
