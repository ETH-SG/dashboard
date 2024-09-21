import React, { useEffect, useState } from "react";
import { generateApiKey } from "reversifi-sdk/src/services/supabase"
import { useReadContract } from "wagmi";
import newAbi from "../new.json"

const ProfileContent = () => {
  const [apiKey, setApiKey] = useState("");

  const handleGenerateApiKey = async () => {
    try {
      const result = await generateApiKey();
      console.log("Generated API Key:", result);
      if (result && result[0] && result[0].apikey) {
        setApiKey(result[0].apikey);
      }
    } catch (error) {
      console.error("Error generating API key:", error);
    }
  }

  const result = useReadContract({
    abi: newAbi,
    address: '0xc535413eBc51e0958B3986975cB1C4316a1819c8',
    functionName: 'getAllEscrow',
  })

  useEffect(() => {
    if(result){
      console.log("all escrow ", result)
    }
    
    
  },[result]);

  

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Profile</h2>
      <h1>Generate API Key</h1>
      <button 
        onClick={handleGenerateApiKey}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Generate API Key
      </button>
      {apiKey && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold">Your API Key:</h2>
          <p className="bg-gray-100 p-2 rounded break-all">{apiKey}</p>
        </div>
      )}
      <br />

      <h1 className="mt-8">History transactions</h1>

    </div>
  );
};

export default ProfileContent;