"use client";

import React, { useEffect, useState } from "react";
import {
  useAccount,
  usePublicClient,
  useWaitForTransactionReceipt,
  useWriteContract,
  useWatchContractEvent,
} from "wagmi";
import newAbi from "../new.json";

const DeployContent = () => {
  const { address } = useAccount();
  const [account, setAccount] = useState<`0x${string}` | undefined>(undefined);
  useEffect(() => {
    if (address) {
      setAccount(address);
    }
  }, [address]);

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

  // Watch for EscrowCreated event
  useWatchContractEvent({
    address: "0xb38e4d2bee4Ea3cb7EcFf3a0dF8aFc9Fafca023D",
    abi: newAbi,
    eventName: "EscrowCreated",
    onLogs(logs) {
      console.log("EscrowCreated event:", logs);
      if (logs[0] && logs[0].args && logs[0].args.escrow) {
        setCreatedEscrowAddress(logs[0].args.escrow);
      }
    },
  });

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

  return (
    <div>
      <h2 className="text-3xl font-black mb-4">Deploy</h2>
      <h1 className="font-bold">Connected Account Address</h1>
      {account ? account : "No account connected"}

      <br />
      <br />
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
      {(hash || isConfirming || isConfirmed || error || message || createdEscrowAddress) && (
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

// useEffect(() => {
//   async function getContractAddress() {
//     if (isConfirmed && hash && publicClient) {
//       try {
//         const receipt = await publicClient.getTransactionReceipt({ hash });
//         if (receipt.contractAddress) {
//           setContractAddress(receipt.contractAddress);
//         } else if (receipt.status === "success") {
//           const tx = (await publicClient.getTransaction({
//             hash,
//           })) as Transaction;
//           if (tx.creates) {
//             setContractAddress(tx.creates);
//           } else {
//             setContractAddress("");
//           }
//         } else {
//           setContractAddress("");
//           setMessage("Transaction was not successful");
//         }
//       } catch (error) {
//         console.error("Error getting contract address:", error);
//         setMessage("Error getting contract address");
//         setContractAddress("");
//       }
//     }
//   }

//   getContractAddress();
// }, [isConfirmed, hash, publicClient]);

{
  /* {contractAddress && (
                <p>Contract deployed at: {contractAddress}</p>
              )} */
}

