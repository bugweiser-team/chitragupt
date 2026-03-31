"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type CaseContextType = {
  currentIssue: string;
  category: string;
  stateLocation: string;
  language: string;
  amount: string;
  urgency: string;
  documentsGenerated: { type: string; date: string }[];
  chatHistory: { role: string; content: string }[];
  updateCase: (data: Partial<CaseContextType>) => void;
  addDocument: (type: string) => void;
  addChat: (role: string, content: string) => void;
};

const defaultContext: CaseContextType = {
  currentIssue: "",
  category: "",
  stateLocation: "Madhya Pradesh",
  language: "English",
  amount: "",
  urgency: "Normal",
  documentsGenerated: [],
  chatHistory: [],
  updateCase: () => {},
  addDocument: () => {},
  addChat: () => {}
};

export const CaseContext = createContext<CaseContextType>(defaultContext);

export function CaseProvider({ children }: { children: React.ReactNode }) {
  const [caseData, setCaseData] = useState<Omit<CaseContextType, "updateCase" | "addDocument" | "addChat">>({
    currentIssue: "",
    category: "",
    stateLocation: "Madhya Pradesh",
    language: "English",
    amount: "",
    urgency: "Normal",
    documentsGenerated: [],
    chatHistory: [],
  });

  // Load from session storage on mount
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("chitragupta_case");
      if (saved) {
        setCaseData(JSON.parse(saved));
      }
    } catch (e) {}
  }, []);

  // Save to session storage on change
  useEffect(() => {
    sessionStorage.setItem("chitragupta_case", JSON.stringify(caseData));
  }, [caseData]);

  const updateCase = (data: Partial<typeof caseData>) => {
    setCaseData(prev => ({ ...prev, ...data }));
  };

  const addDocument = (type: string) => {
    setCaseData(prev => ({
      ...prev,
      documentsGenerated: [...prev.documentsGenerated, { type, date: new Date().toISOString() }]
    }));
  };

  const addChat = (role: string, content: string) => {
    setCaseData(prev => ({
      ...prev,
      chatHistory: [...prev.chatHistory, { role, content }]
    }));
  };

  return (
    <CaseContext.Provider value={{ ...caseData, updateCase, addDocument, addChat }}>
      {children}
    </CaseContext.Provider>
  );
}

export function useCase() {
  return useContext(CaseContext);
}
