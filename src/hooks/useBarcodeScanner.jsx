import {useState, useRef} from 'react';

const useBarcodeScanner = () => {
  const [showScanner, setShowScanner] = useState(false);
  const [torchEnabled, setTorchEnabled] = useState(false);
  const [scannedData, setScannedData] = useState(null);
  const lastScannedCode = useRef(null); // Store the last scanned code

  const toggleTorch = () => setTorchEnabled(prev => !prev);

  const onReadCode = (codes = []) => {
    const supportedCodeFormats = ['ean-8', 'ean-13', 'upc-a', 'upc-e'];

    for (const code of codes) {
      const codeFormat = code.type?.toLowerCase();
      const codeValue = code.value;

      if (supportedCodeFormats.includes(codeFormat)) {
        if (lastScannedCode.current === codeValue) {
          // console.log('Duplicate scan detected, ignoring...');
          return;
        }
        lastScannedCode.current = codeValue;
        const scannedCode = {format: codeFormat, value: codeValue};
        setScannedData(scannedCode);
        setShowScanner(false);
        break; // Exit after first valid scan
      }
    }
  };

  const resetScanner = () => {
    setScannedData(null);
    lastScannedCode.current = null; // Reset last scanned code
  };

  return {
    showScanner,
    setShowScanner,
    torchEnabled,
    toggleTorch,
    scannedData,
    onReadCode,
    resetScanner,
  };
};

export default useBarcodeScanner;
