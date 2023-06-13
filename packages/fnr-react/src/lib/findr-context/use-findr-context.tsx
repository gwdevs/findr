import { useContext } from "react";
import { FindrContext } from "./findr-provider";

export const useFindrContext = () => {
  const context = useContext(FindrContext);
  if (!context) {
    throw new Error('useFindrContext has to be used within <FindrProvider>');
  }
  return context;
};

export default useFindrContext;