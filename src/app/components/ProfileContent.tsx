import React, { useEffect, useState } from "react";
// @ts-expect-error dari sana nya
import { generateApiKey } from "reversifi-sdk/src/services/supabase";
import { useAccount, useReadContract } from "wagmi";
import newAbi from "../new.json";
import axios from "axios";

type ApiResponse = {
  data: {
    id: number;
    organization_wallet: string;
    escrow_factory: string;
    created_at: string;
  }[];
};

const ProfileContent = () => {
  const [apiKey, setApiKey] = useState("");
  const { address } = useAccount();

  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  // const [message, setMessage] = useState("");

  useEffect(() => {
    if (address) {
      fetchFactoryEscrow(address);
    }
  }, [address]);

  const fetchFactoryEscrow = async (address: string) => {
    setIsLoading(true);
    try {
      const response = await axios.get<ApiResponse>(
        `http://34.84.200.57:8000/api/escrow/getFactoryEscrow/${address}`
      );
      setApiResponse(response.data);
    } catch (error) {
      console.error("Error fetching factory escrow:", error);
      // setMessage("Error fetching factory escrow data");
    } finally {
      setIsLoading(false);
    }
  };

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
  };

  const escrowFactoryAddress = apiResponse?.data[0]?.escrow_factory;

  const result = useReadContract({
    abi: newAbi,
    address: escrowFactoryAddress as `0x${string}` | undefined,
    functionName: "getAllEscrow",
  });

  useEffect(() => {
    if (result) {
      console.log("all escrow ", result);
    }
  }, [result]);

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
          <p className="bg-gray-100 p-2 rounded break-all dark:text-black">{apiKey}</p>
        </div>
      )}
      <br />

      {/* <div className="mt-8">
        <h1 className="text-xl font-bold mb-4">Escrow Factory Contract</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : apiResponse && apiResponse.data.length > 0 ? (
          <div>
            <p>Escrow Factory: {apiResponse.data[0].escrow_factory}</p>
          </div>
        ) : (
          <h1>You have no escrow factory contract</h1>
        )}
      </div>

      <div>
        <h1 className="mt-8">History transactions</h1>

        {result.isLoading ? (
          <p>Loading escrow data...</p>
        ) : result.error ? (
          <p>Error loading escrow data: {result.error.message}</p>
        ) : (
          <p>Escrow data loaded. Check console for details.</p>
        )}
      </div> */}

      <div className="mt-8">
        <h1 className="text-xl font-bold mb-4">Escrow Factory Contract</h1>
        {isLoading ? (
          <p>Loading...</p>
        ) : apiResponse && apiResponse.data.length > 0 ? (
          <div>
            <p>Escrow Factory: {apiResponse.data[0].escrow_factory}</p>
            {result.isLoading ? (
              <p>Loading escrow data...</p>
            ) : result.error ? (
              <p>Error loading escrow data: {result.error.message}</p>
            ) : result.data === undefined ? (
              <p>No data returned from contract.</p>
            ) : (result.data as string[]).length > 0 ? (
              <div>
                <h2 className="text-lg font-semibold mt-4">
                  Escrow Addresses:
                </h2>
                <ul className="list-disc pl-5">
                  {(result.data as string[]).map((address, index) => (
                    <li key={index} className="mb-2">
                      <span className="font-mono">{address}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <p>No escrow addresses found.</p>
            )}
          </div>
        ) : (
          <h1>You have no escrow factory contract</h1>
        )}
      </div>
    </div>
  );
};

export default ProfileContent;
