"use client";

import React, { useEffect, useState } from "react";
import {
  useAccount,
  useWaitForTransactionReceipt,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import newAbi from "../new.json";
import axios from "axios";

import { Log } from "viem";

type ParsedEscrowCreatedLog = Log & {
  args: {
    escrow: string;
  };
};

type ApiResponse = {
  data: {
    id: number;
    organization_wallet: string;
    escrow_factory: string;
    created_at: string;
  }[];
};

const DeployContent = () => {
  const { address } = useAccount();
  const [account, setAccount] = useState<`0x${string}` | undefined>(undefined);

  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (address) {
      setAccount(address);
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
      setMessage("Error fetching factory escrow data");
    } finally {
      setIsLoading(false);
    }
  };

  const { data: hash, error, isPending, writeContract } = useWriteContract();
  const [message, setMessage] = useState("");
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // New state for user inputs
  const [name, setName] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");

  // New state for created Escrow address
  const [createdEscrowAddress, setCreatedEscrowAddress] = useState("");

  useEffect(() => {
    if (isConfirmed && createdEscrowAddress) {
      console.log("New Factory contract created at:", createdEscrowAddress);
      // You can perform additional actions here with the new contract address
    }
  }, [isConfirmed, createdEscrowAddress]);

  const handleDeploy = () => {
    try {
      writeContract({
        abi: newAbi,
        address: "0xb38e4d2bee4Ea3cb7EcFf3a0dF8aFc9Fafca023D",
        functionName: "createEscrow",
        args: [name, address1, address2],
      });
    } catch (error) {
      console.error("Error deploying contract", error);
      setMessage("Error deploying contract");
    }
  };

  // Watch for EscrowCreated event
  useWatchContractEvent({
    address: "0xb38e4d2bee4Ea3cb7EcFf3a0dF8aFc9Fafca023D",
    abi: newAbi,
    eventName: "EscrowCreated",
    onLogs(logs: Log[]) {
      console.log("EscrowCreated event:", logs);
      // Parse the log
      const parsedLog = logs[0] as ParsedEscrowCreatedLog;
      const newEscrowAddress = parsedLog.args.escrow;
      setCreatedEscrowAddress(newEscrowAddress);

      // Make POST request to add the new escrow factory
      if (account) {
        addEscrowFactory(account, newEscrowAddress);
      }
    },
  });

  const addEscrowFactory = async (
    organizationAddress: string,
    escrowAddress: string
  ) => {
    try {
      const response = await axios.post(
        "http://34.84.200.57:8000/api/escrow/addEscrowFactory",
        {
          organization_address: organizationAddress,
          escrow_factory: escrowAddress,
        }
      );
      console.log("Escrow factory added successfully:", response.data);
      // Optionally update UI or state based on successful addition
    } catch (error) {
      console.error("Error adding escrow factory:", error);
      setMessage("Error adding escrow factory to the database");
    }
  };

  return (
    <div>
      <h2 className="text-4xl font-black mb-4">Deploy</h2>
      <h1 className="font-bold text-2xl mb-2">Organization Address</h1>
      <div className="border border-gray-700 p-2 rounded-lg">{account ? account : "No account connected"}</div>
      

      <br />
      <br />

      {isLoading ? (
        <p>Loading...</p>
      ) : apiResponse && apiResponse.data.length > 0 ? (
        <div>
          <h1 className="font-bold text-2xl">Existing Escrow Factory Contract</h1>
          <p>
            Escrow factory contract is: {apiResponse.data[0].escrow_factory}
          </p>
        </div>
      ) : (
        <div>
          <h1 className="font-bold text-2xl mb-3">Deploy Contract with parameters</h1>
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-700 hover:border-purple-400 rounded-lg p-2 mb-3 w-full bg-black hover:shadow-purple-300 hover:shadow-sm"
            />
            <input
              type="text"
              placeholder="Address 1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="border border-gray-700 hover:border-purple-400 p-2 rounded-lg mb-3 w-full bg-black hover:shadow-purple-300 hover:shadow-sm"
            />
            <input
              type="text"
              placeholder="Address 2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className="border border-gray-700 hover:border-purple-400 p-2 rounded-lg mb-3 w-full bg-black hover:shadow-purple-300 hover:shadow-sm"
            />
            <button
              onClick={handleDeploy}
              disabled={isPending || !name || !address1 || !address2}
              className="bg-purple-500 text-white p-2 rounded-lg disabled:bg-gray-300"
            >
              {isPending ? "Deploying..." : "Deploy Contract"}
            </button>
          </div>
        </div>
      )}

      {(hash ||
        isConfirming ||
        isConfirmed ||
        error ||
        message ||
        createdEscrowAddress) && (
        <div>
          {hash && <p>Transaction Hash: {hash}</p>}
          {isConfirming && <p>Waiting for confirmation...</p>}
          {isConfirmed && (
            <div>
              <p>Transaction confirmed.</p>
            </div>
          )}
          {error && <p>Error: {error.message}</p>}
          {message && <p>{message}</p>}
          {createdEscrowAddress && (
            <p>New Factory contract created at: {createdEscrowAddress}</p>
          )}
        </div>
      )}
    </div>
  );
};

export default DeployContent;
