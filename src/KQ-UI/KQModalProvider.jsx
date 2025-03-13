//* KQModalProvider.jsx
import React, {createContext, useContext, useState} from 'react';
import KQModal from './KQModal';

const ModalContext = createContext();

export const KQModalProvider = ({children}) => {
  const defaultModalProps = {
    visible: false,
    size: 'full',
    title: '',
    children: null,
    font: 'open-6',
    fontSize: 'medium',
    hapticFeedback: 'light',
    height: '90%',
    width: '90%',
    centered: false,
    noTitle: false,
    noHeader: false,
    noCloseButton: false,
    globalView: false,
    onClose: () => hideModal(),
  };

  const [modalProps, setModalProps] = useState(defaultModalProps);

  const showModal = props => {
    setModalProps(prev => ({
      ...defaultModalProps, // Reset modal to default values
      ...props, // Apply new props
      visible: false, // Ensure state resets before showing
    }));

    setTimeout(() => {
      setModalProps(prev => ({
        ...prev,
        visible: true, // Reopen after state resets
      }));
    }, 10);
  };

  const hideModal = () => {
    setModalProps(prev => ({
      ...prev,
      visible: false,
    }));
  };

  return (
    <ModalContext.Provider value={{showModal, hideModal}}>
      {children}
      <KQModal {...modalProps} />
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);
