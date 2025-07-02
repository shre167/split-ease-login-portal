import React, { useRef, useEffect, useState } from 'react';
import { Home, Users, QrCode, User, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { BrowserQRCodeReader, NotFoundException } from '@zxing/library';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const videoRef = useRef(null);
  const codeReader = useRef(new BrowserQRCodeReader());
  const [error, setError] = useState(null);
  const [uploadedImageSrc, setUploadedImageSrc] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('camera'); // 'camera' or 'upload'

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleScanResult = (data) => {
    if (!data) return;

    console.log('QR Code detected:', data);
    setScanResult(data);
    stopScanning();

    try {
      new URL(data); // Validate URL
      setShowScanner(false);
      window.open(data, '_blank', 'noopener,noreferrer');
    } catch {
      setError(`QR Content: "${data}" (Not a valid URL)`);
    }
  };

  const stopScanning = () => {
    if (codeReader.current) {
      codeReader.current.reset();
      setIsScanning(false);
    }
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
  };

  const startCameraScan = async () => {
    try {
      setError(null);
      setIsScanning(true);
      setUploadedImageSrc(null);
      
      const devices = await codeReader.current.listVideoInputDevices();
      if (!devices || devices.length === 0) {
        setError('No camera found. Please connect a camera.');
        setIsScanning(false);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      const decodeCallback = (result, err) => {
        if (result) {
          handleScanResult(result.text);
        }
        if (err && !(err instanceof NotFoundException)) {
          console.error('Scan error:', err);
          setError('Scanning error. Please try again.');
        }
      };

      codeReader.current.decodeFromVideoElement(videoRef.current, decodeCallback);
    } catch (e) {
      console.error('Camera error:', e);
      setError(e.message.includes('permission') 
        ? 'Camera permission denied. Please allow camera access.'
        : 'Failed to access camera. Please try again.');
      setIsScanning(false);
    }
  };

  useEffect(() => {
    if (showScanner && activeTab === 'camera') {
      startCameraScan();
    } else {
      stopScanning();
    }

    return () => {
      stopScanning();
    };
  }, [showScanner, activeTab]);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setError(null);
    setScanResult(null);
    stopScanning();
    setActiveTab('upload');

    try {
      const imageUrl = URL.createObjectURL(file);
      setUploadedImageSrc(imageUrl);

      const img = new Image();
      img.src = imageUrl;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => reject(new Error('Failed to load image'));
      });

      const result = await codeReader.current.decodeFromImageElement(img);
      handleScanResult(result.text);
    } catch (decodeErr) {
      console.error('Decode error:', decodeErr);
      setError(decodeErr instanceof NotFoundException
        ? 'No QR code found in image. Try another.'
        : 'Failed to decode QR code.');
    } finally {
      if (uploadedImageSrc) URL.revokeObjectURL(uploadedImageSrc);
      setUploadedImageSrc(null);
    }
  };

  const closeScanner = () => {
    stopScanning();
    setShowScanner(false);
    setUploadedImageSrc(null);
    setError(null);
    setScanResult(null);
  };

  const switchToCamera = () => {
    setActiveTab('camera');
    setUploadedImageSrc(null);
    setError(null);
  };

  return (
    <>
      {/* QR Scanner Overlay */}
      {showScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 max-w-sm relative">
            <button
              onClick={closeScanner}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
              aria-label="Close scanner"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-center mb-2">Scan QR Code</h2>
            
            {/* Tab Selector */}
            <div className="flex mb-4 border-b">
              <button
                className={`flex-1 py-2 font-medium ${activeTab === 'camera' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={switchToCamera}
              >
                Camera
              </button>
              <button
                className={`flex-1 py-2 font-medium ${activeTab === 'upload' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('upload')}
              >
                Upload Image
              </button>
            </div>
            
            {error && (
              <p className="text-red-500 text-center text-sm mb-4">{error}</p>
            )}
            
            {scanResult && !error && (
              <p className="text-green-600 text-center text-sm mb-4">
                Detected: {scanResult.length > 30 
                  ? `${scanResult.substring(0, 30)}...` 
                  : scanResult}
              </p>
            )}

            {activeTab === 'upload' ? (
              <>
                {uploadedImageSrc ? (
                  <img 
                    src={uploadedImageSrc} 
                    alt="Uploaded QR Code" 
                    className="w-full rounded border border-gray-300 max-h-64 object-contain" 
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-64 border-2 border-dashed border-gray-300 rounded-lg">
                    <label className="cursor-pointer text-blue-600 underline text-sm hover:text-blue-800">
                      Click to upload QR code image
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                      />
                    </label>
                  </div>
                )}
              </>
            ) : (
              <video 
                ref={videoRef} 
                className="w-full rounded border border-gray-300 max-h-64 object-contain" 
                autoPlay 
                muted 
                playsInline 
              />
            )}

            <div className="mt-4 text-center">
              {activeTab === 'camera' && (
                <p className="text-sm text-gray-500">Point your camera at a QR code</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t px-4 py-2 flex justify-around items-center z-40">
        <button onClick={() => navigate('/home')} className="flex flex-col items-center text-sm text-gray-600 hover:text-purple-600 transition-colors">
          <Home className="w-5 h-5 mb-1" /> Home
        </button>

        <button onClick={() => navigate('/groups')} className="flex flex-col items-center text-sm text-gray-600 hover:text-purple-600 transition-colors">
          <Users className="w-5 h-5 mb-1" /> Groups
        </button>

        <button
          onClick={() => setShowScanner(true)}
          className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-4 rounded-full shadow-lg -mt-8 hover:scale-105 transition-all duration-300 ease-in-out flex items-center justify-center"
          aria-label="Scan QR Code"
        >
          <QrCode className="w-6 h-6" />
        </button>

        <button onClick={() => navigate('/profile')} className="flex flex-col items-center text-sm text-gray-600 hover:text-purple-600 transition-colors">
          <User className="w-5 h-5 mb-1" /> Profile
        </button>

        <button onClick={handleLogout} className="flex flex-col items-center text-sm text-gray-600 hover:text-red-500 transition-colors">
          <LogOut className="w-5 h-5 mb-1" /> Logout
        </button>
      </nav>
    </>
  );
};

export default BottomNavigation;