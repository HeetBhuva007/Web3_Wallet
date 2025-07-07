import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Buffer } from 'buffer';
window.Buffer = Buffer; // Required for bip39/crypto libraries in some browser environments
import * as bip39 from 'bip39';
import CryptoJS from 'crypto-js';
import { Wallet, Copy, AlertTriangle, ChevronRight, Lock, LoaderCircle } from 'lucide-react';
import axiosClient from '../utils/axiosClient';

const CreateWalletPage = () => {
  const [seedPhrase, setSeedPhrase] = useState('');
  const [isGenerated, setIsGenerated] = useState(false);
  const [copySuccess, setCopySuccess] = useState('');
  
  // --- NEW STATE FOR PASSWORD AND LOADING ---
  const [password, setPassword] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const navigate = useNavigate();

  const handleGenerateSeed = () => {
    const mnemonic = bip39.generateMnemonic();
    setSeedPhrase(mnemonic);
    setIsGenerated(true);
  };

  // --- UPDATED CONFIRM HANDLER ---
  const handleConfirm = async (e) => {
    e.preventDefault(); // Prevent form submission from reloading page

    if (password.length < 8) {
      alert("Password must be at least 8 characters long.");
      return;
    }

    setIsCreating(true);
    try {
      // Use the password from state to encrypt the seed
      const encryptedSeed = CryptoJS.AES.encrypt(seedPhrase, password).toString();

      // Your existing API call, now sending a proper JSON object
      await axiosClient.post('/wallet/createWallet', { encryptedSeed });
      
     
      navigate('/dashboard');

    } catch (err) {
      console.error("Wallet creation failed:", err);
      alert("Failed to create wallet. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };
  
  const handleCopySeed = () => {
    navigator.clipboard.writeText(seedPhrase).then(() => {
        setCopySuccess('Copied!');
        setTimeout(() => setCopySuccess(''), 2000);
    });
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 font-mono noise-background text-text-color">
      <div className="w-full max-w-lg p-8 space-y-6 text-center transition-all duration-500 backpack-card">
        {!isGenerated ? (
          // --- View 1: Initial Prompt ---
          <>
            <div className="flex justify-center"><Wallet size={48} className="text-brand-red" /></div>
            <h1 className="text-2xl font-bold text-white">Create a New Wallet</h1>
            <p className="text-sm text-gray-400">Generate a new secure wallet and a unique 12-word secret recovery phrase.</p>
            <div className="pt-4"><button onClick={handleGenerateSeed} className="w-full max-w-xs mx-auto backpack-button">Create New Wallet</button></div>
          </>
        ) : (
          // --- View 2: Display Seed, Get Password, and Confirm ---
          <>
            <h1 className="text-2xl font-bold text-white">Your Secret Phrase</h1>
            <p className="text-sm text-gray-400">This is your master key. Write it down in a safe place.</p>
            <div className="grid grid-cols-2 gap-3 p-4 my-4 text-left bg-black/50 rounded-lg sm:grid-cols-3">
              {seedPhrase.split(' ').map((word, index) => (
                <div key={index} className="p-2 text-sm rounded-md select-all bg-border-color/30">
                  <span className="mr-2 text-gray-500">{index + 1}.</span>
                  <span className="font-semibold text-white">{word}</span>
                </div>
              ))}
            </div>
            <button onClick={handleCopySeed} className="flex items-center justify-center w-full gap-2 py-2 text-sm text-gray-300 transition-colors bg-gray-700/50 rounded-lg hover:bg-gray-600">
                <Copy size={16} /> {copySuccess || 'Copy to Clipboard'}
            </button>
            <div className="p-4 mt-6 text-left border-l-4 border-brand-red bg-brand-red/10">
                <div className="flex"><div className="py-1"><AlertTriangle size={20} className="text-brand-red" /></div><div className="ml-3"><h3 className="text-sm font-bold text-white">Do not lose these words.</h3><p className="mt-1 text-xs text-red-200/80">This is the ONLY time you will see them. Store them securely.</p></div></div>
            </div>

            {/* --- NEW PASSWORD SECTION --- */}
            <form onSubmit={handleConfirm} className="w-full max-w-sm mx-auto mt-6 space-y-4 text-left">
                <div>
                    <label htmlFor="password" className="block mb-2 text-sm font-bold text-white">
                        Create a Secure Password
                    </label>
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <input
                            id="password"
                            type="password"
                            placeholder="8+ characters to encrypt your wallet"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 text-sm rounded-lg backpack-input"
                            required
                        />
                    </div>
                </div>
                
                {/* --- UPDATED NAVIGATION BUTTON --- */}
                <button 
                  type="submit"
                  disabled={isCreating || password.length < 8}
                  className="flex items-center justify-center w-full gap-2 backpack-button disabled:opacity-50"
                >
                  {isCreating ? (
                    <>
                      <LoaderCircle className="animate-spin" size={18} />
                      Creating Wallet...
                    </>
                  ) : (
                    <>
                      Create Wallet & Finish
                      <ChevronRight size={18} />
                    </>
                  )}
                </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default CreateWalletPage;