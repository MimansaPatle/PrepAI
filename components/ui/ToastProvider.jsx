
"use client";

import { createContext, useContext, useState } from "react";
import AIAssistantToast from "./AIAssistantToast";
import { useEffect } from "react";

const ToastContext = createContext();

export function ToastProvider({ children }) {
 const [toast, setToast] = useState(null);
const [queue, setQueue] = useState([]);

const showToast = ({
  title,
  description,
  type = "success",
}) => {
  const newToast = {
    title,
    description,
    type,
    show: true,
  };

  if (!toast) {
    setToast(newToast);

    setTimeout(() => {
      setToast(null);
    }, 3000);
  } else {
    setQueue((prev) => [...prev, newToast]);
  }
};

const closeToast = () => {
  setToast(null);
};

useEffect(() => {
  if (toast || queue.length === 0) return;

  const nextToast = queue[0];

  setToast(nextToast);
  setQueue((prev) => prev.slice(1));

  const timer = setTimeout(() => {
    setToast(null);
  }, 3000);

  return () => clearTimeout(timer);
}, [toast, queue]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}

    <AIAssistantToast
  show={!!toast}
  title={toast?.title}
  description={toast?.description}
  type={toast?.type}
  onClose={closeToast}
/>
    </ToastContext.Provider>
  );
}

export function useToast() {
  return useContext(ToastContext);
}