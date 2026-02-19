import React, { createContext, useContext, useState, useCallback } from 'react';
import ActionAlert from '@/components/ui/ActionAlert';

const ActionAlertContext = createContext();

export const useActionAlert = () => useContext(ActionAlertContext);

export const ActionAlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({
    open: false,
    type: 'info',
    title: '',
    message: '',
    actionLabel: '',
    onAction: null,
    secondaryLabel: 'Cancel'
  });

  const showAlert = useCallback((options) => {
    setAlertState({ ...options, open: true });
  }, []);

  const closeAlert = useCallback(() => {
    setAlertState((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <ActionAlertContext.Provider value={{ showAlert, closeAlert }}>
      {children}
      <ActionAlert 
        {...alertState} 
        onClose={closeAlert} 
      />
    </ActionAlertContext.Provider>
  );
};