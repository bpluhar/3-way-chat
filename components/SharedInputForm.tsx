"use client";

import React, { useEffect, useState } from "react";

interface SharedInputFormProps {
  onSubmit: (input: string) => void;
  synced: boolean;
  syncedInput: string;
  onSyncedInputChange: (value: string) => void;
  apiEndpoint: string;
}

export default function SharedInputForm({
  onSubmit,
  synced,
  syncedInput,
  onSyncedInputChange,
}: SharedInputFormProps) {
  const [localInput, setLocalInput] = useState("");

  useEffect(() => {
    if (synced) {
      setLocalInput(syncedInput);
    }
  }, [synced, syncedInput]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newValue = e.target.value;
    setLocalInput(newValue);
    if (synced) {
      onSyncedInputChange(newValue);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const inputToSubmit = synced ? syncedInput : localInput;
    onSubmit(inputToSubmit);
    if (!synced) {
      setLocalInput("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full">
      <textarea
        className="flex-grow p-2 bg-[#060F11] text-zinc-100 border border-yellow-500 rounded-l-xl focus:outline-none focus:border-yellow-500 resize-none"
        value={synced ? syncedInput : localInput}
        placeholder="Say something..."
        onChange={(e) => {
          handleInputChange(e);
          e.target.rows = Math.min(5, e.target.value.split("\n").length);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
          }
        }}
        rows={1}
        style={{ maxWidth: "100%", overflowWrap: "break-word" }}
      />
      <button
        type="submit"
        className="py-2 px-4 bg-[#060F11] text-yellow-500 font-bold rounded-r-xl border border-yellow-500 transition-colors hover:bg-yellow-500 hover:text-[#060F11]"
      >
        Send
      </button>
    </form>
  );
}
