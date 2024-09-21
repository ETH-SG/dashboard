import React from 'react';
import { CodeBlock } from 'react-code-block';

const codeExample = `
import {
  ReversifiWidget,
  useReversifiContext,
  getAllEscrow,
} from "reversifi-sdk";

....

const primaryWallet = useReversifiContext();

const handleClick = () => {
    // Run the first command (call the getAllEscrow function)
    getAllEscrow(primaryWallet.primaryWallet);
    
   ....
  };

  return (
  <div>
  .....
  <ReversifiWidget />
  .....
  </div>
  )
`

const SDKSettingsContent = () => (
  <div>
    <h2 className="text-2xl font-bold mb-4">SDK Settings and Snippets</h2>
    <h1> Snippets</h1>
    <CodeBlock code={codeExample} language="js">
      <CodeBlock.Code className="bg-gray-900 p-6 rounded-xl shadow-lg">
        <CodeBlock.LineContent>
          <CodeBlock.Token />
        </CodeBlock.LineContent>
      </CodeBlock.Code>
    </CodeBlock>
  </div>
);

export default SDKSettingsContent;