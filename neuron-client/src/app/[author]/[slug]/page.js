"use client"

import React from 'react';
import { ContractStore } from "../../data/contracts";
import { useParams } from 'next/navigation';
const page = () => {
    const { author, slug } = useParams();
    const contracts = ContractStore.find((ct) => ct.contracts.some((c)=> c.identifier === `${author}/${slug}`));
    console.log(contracts);
    const contract = contracts.contracts.find((c) => c.identifier === `${author}/${slug}`);
    console.log(contract);
    if(!contract) {
        return <div className="container mx-auto p-4">Contract not found</div>
    }

    return (
        <div className="container mx-auto p-4">
            {/* Header Section */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">{contract.source.name}</h1>
                <p className="text-lg text-gray-600 mb-4">{contract.source.description}</p>
                <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full inline-block">
                    Version: {contract.version}
                </div>
            </div>

            {/* Content Section */}
            <div className="prose max-w-none">
                {contract.source.content.map((item, index) => {
                    switch(item.tag) {
                        case 'h1':
                            return <h1 key={index} className="text-3xl font-bold mt-6 mb-4">{item.content}</h1>
                        case 'h2':
                            return <h2 key={index} className="text-2xl font-semibold mt-6 mb-3">{item.content}</h2>
                        case 'p':
                            return <p key={index} className="mb-4">{item.content}</p>
                        case 'ul':
                            return <div key={index} className="mb-4" dangerouslySetInnerHTML={{ __html: item.content }} />
                        default:
                            return null;
                    }
                })}
            </div>

            {/* Functions Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Functions</h2>
                
                {/* Write Functions */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Write Functions</h3>
                    <div className="grid gap-4">
                        {contract.source.functions.write.map((func, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow">
                                <h4 className="font-medium text-blue-600">{func.function}</h4>
                                <code className="text-sm text-gray-600 block mt-1">{func.signature}</code>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Read Functions */}
                <div className="mb-6">
                    <h3 className="text-xl font-semibold mb-3">Read Functions</h3>
                    <div className="grid gap-4">
                        {contract.source.functions.read.map((func, index) => (
                            <div key={index} className="bg-white p-4 rounded-lg shadow">
                                <h4 className="font-medium text-green-600">{func.function}</h4>
                                <code className="text-sm text-gray-600 block mt-1">{func.signature}</code>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Resources Section */}
            <div className="mt-8">
                <h2 className="text-2xl font-bold mb-4">Resources</h2>
                <div className="grid gap-3">
                    {contract.source.resources.map((resource, index) => (
                        <a 
                            key={index}
                            href={resource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            {resource.title}
                        </a>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default page;