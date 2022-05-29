import React, { useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";

const CopyButton = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false);
  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <>
      <CopyToClipboard text={text} onCopy={onCopyText}>
        <button id="copy-btn">
          <span>{isCopied ? "copied!" : "copy"}</span>
        </button>
      </CopyToClipboard>
    </>
  );
};

export default CopyButton;
