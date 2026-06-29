import { useState } from "react";
import { IconButton } from "./IconButton";

interface CopyButtonProps {
  text: string;
  label?: string;
}

export function CopyButton({ text, label = "⎘" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <IconButton
      variant="secondary"
      size="md"
      onClick={handleCopy}
      ariaLabel={copied ? "Copied!" : "Copy to clipboard"}
    >
      {copied ? "✓" : label}
    </IconButton>
  );
}
