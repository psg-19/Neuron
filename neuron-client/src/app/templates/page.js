"use client"

import { ContractStore } from "../data/contracts";
import React from 'react'
import { useRouter } from 'next/navigation';
import Link from "next/link";

const page = () => {
  const router = useRouter()
  console.log(ContractStore.map((store) => store.name))
  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {ContractStore.map((store) => (
          <div key={store.identifier} className="mb-8">
            <h2 className="text-2xl font-bold mb-4">{store.name}</h2>
            <div className="grid gap-4">
              {store.contracts.map((contract) => (
                <Link href={`/${contract.identifier}`}><div 
                  key={contract.identifier} 
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <h3 className="text-xl font-semibold mb-2">{contract.name}</h3>
                  <div className="text-sm text-blue-600 mb-2">Version: {contract.version}</div>
                  <p className="text-blue-700 mb-4">{contract.description}</p>
                 
                </div></Link>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default page