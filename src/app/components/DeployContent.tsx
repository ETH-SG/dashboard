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

      // After getting new Escrow Factory Contract Address
      if (account) {
        addEscrowFactory(account, newEscrowAddress);
        claimName(account);
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

  const claimName = async (userWalletAddress: string) => {
    try {
      const response = await axios.post('/api/claim-name', {
        name,
        userWalletAddress
      });
      console.log('Response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error claiming name:', error);
      throw error;
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-black mb-4">Deploy</h2>
      <h1 className="font-bold">Connected Account Address</h1>
      {account ? account : "No account connected"}

      <br />
      <br />

      {isLoading ? (
        <p>Loading...</p>
      ) : apiResponse && apiResponse.data.length > 0 ? (
        <div>
          <h1 className="font-bold">Existing Escrow Factory Contract</h1>
          <p>
            Escrow factory contract is: {apiResponse.data[0].escrow_factory}
          </p>
        </div>
      ) : (
        <div>
          <h1 className="font-bold">Deploy Contract with parameters</h1>
          <div>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Address 1"
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className="border p-2 mb-2 w-full"
            />
            <input
              type="text"
              placeholder="Address 2"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className="border p-2 mb-2 w-full"
            />
            <button
              onClick={handleDeploy}
              disabled={isPending || !name || !address1 || !address2}
              className="bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"
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
