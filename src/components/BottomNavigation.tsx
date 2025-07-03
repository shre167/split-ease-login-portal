import React, { useRef, useEffect, useState } from 'react';
import { Home, Users, QrCode, User, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import jsQR from 'jsqr';
import Payments from '@/components/Payments/PaymentHistory';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [uploadedImageSrc, setUploadedImageSrc] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [activeTab, setActiveTab] = useState('camera');

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

    if (data.startsWith('upi://')) {
      setShowScanner(false);
      window.location.href = data;
    } else {
      try {
        const url = new URL(data);
        setShowScanner(false);
        window.open(data, '_blank', 'noopener,noreferrer');
      } catch {
        setError(`QR Content: "${data}" (Not a valid URL or UPI link)`);
      }
    }
  };

  const stopScanning = () => {
    setIsScanning(false);
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

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: 'environment',
          width: { ideal: 1280 },
          height: { ideal: 720 }
        }
      });

      if (!videoRef.current) return;
      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      const scan = () => {
        if (!videoRef.current || !ctx) return;
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code) {
          handleScanResult(code.data);
        } else if (isScanning) {
          requestAnimationFrame(scan);
        }
      };

      requestAnimationFrame(scan);
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

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return setError('Canvas error.');
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code && code.data) {
          handleScanResult(code.data);
        } else {
          setError('No QR code found in image. Try another screenshot.');
        }
      };
      img.onerror = () => setError('Failed to load image.');
      img.src = event.target?.result;
      setUploadedImageSrc(event.target?.result);
    };
    reader.readAsDataURL(file);
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

      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-lg border-t px-4 py-2 flex justify-around items-center z-40">
        <button onClick={() => navigate('/Dashboard')} className="flex flex-col items-center text-sm text-gray-600 hover:text-purple-600 transition-colors">
          <Home className="w-5 h-5 mb-1" /> Home
        </button>

        <button onClick={() => navigate('/Payments')} className="flex flex-col items-center text-sm text-gray-600 hover:text-purple-600 transition-colors">
          <Users className="w-5 h-5 mb-1" /> My Payments
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
