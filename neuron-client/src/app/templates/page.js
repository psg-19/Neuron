import { ContractStore } from "../data/contracts";
import React from 'react'

const page = () => {
  return (
    <div>
      {
        ContractStore.map
      }
    </div>
  )
}

export default page
