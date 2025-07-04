import React, { useRef, useEffect, useState } from 'react';
import { Home, Users, QrCode, User, LogOut, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import jsQR from 'jsqr';

const BottomNavigation = () => {
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [amount, setAmount] = useState('');
  const [payMethod, setPayMethod] = useState<'qr' | 'mobile' | null>(null);
  const [upiId, setUpiId] = useState('');
  const [scanResult, setScanResult] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploadedImageSrc, setUploadedImageSrc] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const redirectToUPI = (upiLink: string) => {
    const url = new URL(upiLink);
    url.searchParams.set('am', amount);
    window.location.href = url.toString();
  };

  const handleScanResult = (data: string) => {
    if (!data) return;
    stopScanning();
    setScanResult(data);

    if (payMethod === 'qr') {
      if (data.startsWith('upi://')) {
        setShowScanner(false);
        redirectToUPI(data);
      } else {
        try {
          const url = new URL(data);
          window.open(url.toString(), '_blank');
        } catch {
          setError(`QR Content: "${data}" (Not a valid UPI URL)`);
        }
      }
    }
  };

  const startScanner = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }
      scanLoop();
    } catch (e: any) {
      setError('Camera access error: ' + (e?.message || 'Unknown error'));
    }
  };

  const stopScanning = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
  };

  const scanLoop = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const video = videoRef.current;

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);

      if (imageData) {
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code?.data) {
          handleScanResult(code.data);
          return;
        }
      }
    }

    requestAnimationFrame(scanLoop);
  };

  useEffect(() => {
    if (showScanner && activeTab === 'camera' && payMethod === 'qr') {
      startScanner();
    }
    return () => stopScanning();
  }, [showScanner, activeTab, payMethod]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, canvas.width, canvas.height);
        if (code?.data) {
          handleScanResult(code.data);
        } else {
          setError('No QR code found. Try another image.');
        }
      };
      img.src = event.target?.result as string;
      setUploadedImageSrc(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const startPaymentFlow = () => {
    if (!amount) return alert("Please enter amount");
    if (!payMethod) return;

    if (payMethod === 'mobile') {
      if (!upiId || !upiId.includes('@')) return alert("Enter a valid UPI ID like user@bank");
      const upi = `upi://pay?pa=${upiId}&pn=Payee&am=${amount}`;
      window.location.href = upi;
    } else {
      setShowScanner(true);
    }
  };

  const closeScanner = () => {
    stopScanning();
    setShowScanner(false);
    setUploadedImageSrc(null);
    setScanResult(null);
    setError(null);
    setPayMethod(null);
    setAmount('');
    setUpiId('');
  };

  return (
    <>
      {/* Initial Amount + Method Selection */}
      {showScanner && payMethod === null && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 max-w-sm relative">
            <button onClick={closeScanner} className="absolute top-2 right-2 text-gray-600 hover:text-red-500">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-bold mb-4 text-center">Enter Amount</h2>
            <input
              type="number"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />
            <div className="flex flex-col gap-2">
              <button
                className="bg-purple-600 text-white rounded py-2"
                onClick={() => setPayMethod('qr')}
              >
                Pay using QR
              </button>
              <button
                className="bg-purple-100 text-purple-700 rounded py-2"
                onClick={() => setPayMethod('mobile')}
              >
                Pay using UPI ID
              </button>
            </div>
          </div>
        </div>
      )}

      {/* QR Scanner */}
      {showScanner && payMethod === 'qr' && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 max-w-sm relative">
            <button onClick={closeScanner} className="absolute top-2 right-2 text-gray-600 hover:text-red-500">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-center mb-2">Scan QR</h2>

            <div className="flex mb-4 border-b">
              <button
                className={`flex-1 py-2 font-medium ${activeTab === 'camera' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('camera')}
              >
                Camera
              </button>
              <button
                className={`flex-1 py-2 font-medium ${activeTab === 'upload' ? 'text-purple-600 border-b-2 border-purple-600' : 'text-gray-500'}`}
                onClick={() => setActiveTab('upload')}
              >
                Upload
              </button>
            </div>

            {error && <p className="text-red-600 text-sm text-center mb-2">{error}</p>}

            {activeTab === 'upload' ? (
              <div>
                <input type="file" accept="image/*" onChange={handleImageUpload} />
                {uploadedImageSrc && (
                  <img src={uploadedImageSrc} alt="Preview" className="w-full rounded mt-2" />
                )}
              </div>
            ) : (
              <>
                <video ref={videoRef} className="w-full rounded border mb-2 max-h-64 object-contain" autoPlay muted />
                <canvas ref={canvasRef} className="hidden" />
              </>
            )}
          </div>
        </div>
      )}

      {/* Mobile UPI ID Payment */}
      {showScanner && payMethod === 'mobile' && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-11/12 max-w-sm relative">
            <button onClick={closeScanner} className="absolute top-2 right-2 text-gray-600 hover:text-red-500">
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-lg font-semibold text-center mb-4">Pay via UPI ID</h2>
            <input
              type="text"
              placeholder="Enter UPI ID (e.g. tanmay@paytm)"
              value={upiId}
              onChange={(e) => setUpiId(e.target.value)}
              className="w-full border p-2 rounded mb-4"
            />
            <button
              className="bg-purple-600 w-full text-white rounded py-2"
              onClick={startPaymentFlow}
            >
              Continue to Pay
            </button>
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 w-full bg-white shadow-md border-t px-4 py-2 flex justify-around items-center z-40">
        <button onClick={() => navigate('/Dashboard')} className="flex flex-col items-center text-sm text-gray-600 hover:text-purple-600">
          <Home className="w-5 h-5 mb-1" /> Home
        </button>
        <button onClick={() => navigate('/Payments')} className="flex flex-col items-center text-sm text-gray-600 hover:text-purple-600">
          <Users className="w-5 h-5 mb-1" /> My Payments
        </button>
        <button
          onClick={() => {
            setShowScanner(true);
            setPayMethod(null);
          }}
          className="bg-purple-600 text-white p-4 rounded-full shadow-lg -mt-8 hover:scale-105 transition"
        >
          <QrCode className="w-6 h-6" />
        </button>
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center text-sm text-gray-600 hover:text-purple-600">
          <User className="w-5 h-5 mb-1" /> Profile
        </button>
        <button onClick={handleLogout} className="flex flex-col items-center text-sm text-gray-600 hover:text-red-500">
          <LogOut className="w-5 h-5 mb-1" /> Logout
        </button>
      </nav>
    </>
  );
};

export default BottomNavigation;
