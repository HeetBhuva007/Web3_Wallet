import { useState, useEffect } from 'react';
import axiosClient from '../utils/axiosClient';
import { Plus, Send, Droplets, Copy, LoaderCircle, KeyRound, Wallet, User, X, CheckCircle, XCircle, Lock, UserSquare, Coins } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { logoutUser } from '../authSlice';

// --- Helper Components & Functions ---
// const getNetworkIcon = (publicKey) => {
//     if (!publicKey) return null;
//     if (publicKey.startsWith('So')) return <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><title>Solana</title><path d="M6.236 18.046l-4.502-2.652 4.502-2.651 4.502 2.651-4.502 2.652zm.006-6.61L1.74 8.784l4.502-2.651 4.502 2.651-4.502 2.652zm11.522 6.61l-4.502-2.652 4.502-2.651 4.502 2.651-4.502 2.652zm.006-6.61l-4.502-2.652 4.502-2.651 4.502 2.651-4.502 2.652zM6.242 11.22l4.502-2.651 4.502 2.651-4.502 2.652-4.502-2.652z" fill="#f5f5f5"/></svg>;
//     return <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="w-6 h-6"><title>Ethereum</title><path d="M11.944 17.97L4.58 13.62l7.364-4.354 7.364 4.353-7.364 4.35zm.004-17.97L4.58 12.278l7.368 4.35L19.315 12.28 11.948 0z" fill="#f5f5f5"/></svg>;
// };
const truncateAddress = (address) => !address ? '' : `${address.slice(0, 6)}...${address.slice(-4)}`;

// --- The Main Dashboard Component ---
const DashboardPage = () => {
  const [accounts, setAccounts] = useState([]);
  const [balances, setBalances] = useState({});
  const [revealedKeys, setRevealedKeys] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadingStates, setLoadingStates] = useState({});
  const [error, setError] = useState(null);
  const {user}=useSelector(state=>state.auth);
  const dispatch=useDispatch();
  
  const [airdropModalState, setAirdropModalState] = useState({ isOpen: false, account: null });
  const [isAirdropping, setIsAirdropping] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreatingAccount, setIsCreatingAccount] = useState(false);
  const [createPasswordInput, setCreatePasswordInput] = useState('');
  const [sendModalState, setSendModalState] = useState({ isOpen: false, fromAccount: null });
  const [isSending, setIsSending] = useState(false);
  const [sendForm, setSendForm] = useState({ toPublicKey: '', amount: '', password: '' });
  const [toast, setToast] = useState(null);
  const [tempWalletId,setTemp]=useState(null);
  const [viewKeyModalState, setViewKeyModalState] = useState({ isOpen: false, account: null });
  const [isViewingKey, setIsViewingKey] = useState(false);
  const [viewKeyPasswordInput, setViewKeyPasswordInput] = useState('');

  useEffect(()=>{
    const fetchWallet=async()=>{
        const response=await axiosClient.get('/wallet/getWallet');
        
        setTemp(response.data.wallet);
    };
    fetchWallet();
  },[user]);

  const fetchAllAccounts = async () => {
    try {
      const accountsResponse = await axiosClient.get('/wallet/getAllAccount');
      const fetchedAccounts = accountsResponse.data.accounts || [];
      setAccounts(fetchedAccounts);
      await Promise.all(
        fetchedAccounts.map(account => fetchBalanceForAccount(account.publicKey))
      );
    } catch (err) {
      setError('Failed to fetch accounts. Please refresh.');
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setIsLoading(true);
      await fetchAllAccounts();
      setIsLoading(false);
    };
    fetchInitialData();
  }, []);

  const fetchBalanceForAccount = async (publicKey) => {
    setLoadingStates(prev => ({ ...prev, [`balance-${publicKey}`]: true }));
    try {
      const balanceResponse = await axiosClient.get(`/account/getBalance/${publicKey}`);
      const balance = balanceResponse.data.balanceInSOL;
      setBalances(prev => ({ ...prev, [publicKey]: balance }));
    } catch (err) {
      setBalances(prev => ({ ...prev, [publicKey]: 'Error' }));
    } finally {
      setLoadingStates(prev => ({ ...prev, [`balance-${publicKey}`]: false }));
    }
  };

  const handleViewPrivateKey = (account) => {
    if (revealedKeys[account.publicKey]) {
      setRevealedKeys(prev => ({ ...prev, [account.publicKey]: null }));
      return;
    }
    setViewKeyModalState({ isOpen: true, account });
  };

  const handleCloseViewKeyModal = () => {
    setViewKeyModalState({ isOpen: false, account: null });
    setViewKeyPasswordInput('');
  };

  const handleConfirmViewKey = async () => {
    if (!viewKeyModalState.account || !viewKeyPasswordInput) return;
    setIsViewingKey(true);
    const { account } = viewKeyModalState;
    try {
        
      const response = await axiosClient.post('/account/getPrivateKey', {
        publicKey: account.publicKey,
        password: viewKeyPasswordInput,
      });
      
      setRevealedKeys(prev => ({ ...prev, [account.publicKey]: response.data.privateKey }));
      handleCloseViewKeyModal();
    } catch (err) {
      console.error("Failed to fetch private key:", err);
      setToast({ message: "Incorrect password or failed to fetch key.", type: 'error' });
    } finally {
      setIsViewingKey(false);
    }
  };

  const handleOpenAirdropModal = (account) => setAirdropModalState({ isOpen: true, account });
  const handleCloseAirdropModal = () => setAirdropModalState({ isOpen: false, account: null });
  const handleConfirmAirdrop = async () => {
    if (!airdropModalState.account) return;
    setIsAirdropping(true);
    const { publicKey } = airdropModalState.account;
    try {
      await axiosClient.get(`/transaction/airdrop/${publicKey}`);
      setToast({ message: "1 SOL airdropped successfully!", type: 'success' });
      await fetchBalanceForAccount(publicKey);
    } catch (err) {
      console.error("Airdrop failed:", err);
      setToast({ message: "Airdrop failed. Please try again.", type: 'error' });
    } finally {
      setIsAirdropping(false);
      handleCloseAirdropModal();
    }
  };

  const handleOpenCreateModal = () => setIsCreateModalOpen(true);
  const handleCloseCreateModal = () => { setIsCreateModalOpen(false); setCreatePasswordInput(''); };
  const handleConfirmCreateAccount = async () => {
    if (!createPasswordInput) return;
    setIsCreatingAccount(true);
    try {
      const walletId = accounts[0]?.walletId || tempWalletId?._id;
      if (!walletId) {
        setToast({ message: "Cannot create account: Wallet ID not found.", type: 'error' });
        setIsCreatingAccount(false);
        return;
      }
      await axiosClient.post('/wallet/createAccount', { walletId, password: createPasswordInput });
      setToast({ message: 'New account created successfully!', type: 'success' });
      await fetchAllAccounts();
      handleCloseCreateModal();
    } catch (err) {
      console.error("Create account failed:", err);
      setToast({ message: 'Failed to create account. Incorrect password?', type: 'error' });
    } finally {
      setIsCreatingAccount(false);
    }
  };
  
  const handleLogout = async () => { dispatch(logoutUser()); };
  
  const handleOpenSendModal = (account) => setSendModalState({ isOpen: true, fromAccount: account });
  const handleCloseSendModal = () => { setSendModalState({ isOpen: false, fromAccount: null }); setSendForm({ toPublicKey: '', amount: '', password: '' }); };
  const handleConfirmSend = async () => {
    const { fromAccount } = sendModalState;
    const { toPublicKey, amount, password } = sendForm;
    if (!fromAccount || !toPublicKey || !amount || !password) {
      setToast({ message: 'All fields are required.', type: 'error' });
      return;
    }
    setIsSending(true);
    try {
      await axiosClient.post('/transaction/sendSol', { accountId: fromAccount._id, toAddress: toPublicKey, amount: parseFloat(amount), password });
      setToast({ message: `Successfully sent ${amount} SOL!`, type: 'success' });
      await fetchBalanceForAccount(toPublicKey);
      await fetchBalanceForAccount(fromAccount.publicKey);
      handleCloseSendModal();
    } catch (err) {
      console.error("Send transaction failed:", err);
      setToast({ message: 'Transaction failed. Check details and try again.', type: 'error' });
    } finally {
      setIsSending(false);
    }
  };

  const handleCopy = (text) => navigator.clipboard.writeText(text);

  const renderContent = () => {
    if (isLoading) return <SkeletonLoader />;
    if (accounts.length === 0) return <EmptyState onCreate={handleOpenCreateModal} />;
    return (
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {accounts.map((account, index) => (
          <AccountCard
            key={account.publicKey}
            account={account}
            index={index}
            balance={balances[account.publicKey]}
            revealedKey={revealedKeys[account.publicKey]}
            loadingStates={loadingStates}
            onViewKey={() => handleViewPrivateKey(account)}
            onAirdrop={() => handleOpenAirdropModal(account)}
            onSend={() => handleOpenSendModal(account)}
            onCopy={handleCopy}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen w-full font-mono noise-background text-text-color p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col items-start gap-4 mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-1 text-3xl font-bold text-white">
              <User size={30} className="text-brand-red"/>
              <h2>{user ? `${user.userName}'s Dashboard` : 'Dashboard'}</h2>
            </div>
            <p className="mt-1 text-sm text-gray-400">Manage your accounts and assets.</p>
          </div>
          <div className='flex gap-3'>
            <button onClick={handleOpenCreateModal} className="flex items-center  px-4 py-2 text-sm rounded-lg shrink-0 backpack-button">
              <Plus size={16} />Create Account
            </button>
            <button onClick={handleLogout} className="flex items-center  px-4 py-2 text-sm rounded-lg shrink-0 backpack-button">
              Logout
            </button>
          </div>
        </header>
        <main>{renderContent()}</main>
      </div>

      <AirdropConfirmationModal isOpen={airdropModalState.isOpen} onClose={handleCloseAirdropModal} onConfirm={handleConfirmAirdrop} isLoading={isAirdropping} account={airdropModalState.account}/>
      <CreateAccountModal isOpen={isCreateModalOpen} onClose={handleCloseCreateModal} onConfirm={handleConfirmCreateAccount} isLoading={isCreatingAccount} password={createPasswordInput} setPassword={setCreatePasswordInput} />
      <SendSolModal isOpen={sendModalState.isOpen} onClose={handleCloseSendModal} onConfirm={handleConfirmSend} isLoading={isSending} fromAccount={sendModalState.fromAccount} formState={sendForm} setFormState={setSendForm} />
      <ViewKeyModal isOpen={viewKeyModalState.isOpen} onClose={handleCloseViewKeyModal} onConfirm={handleConfirmViewKey} isLoading={isViewingKey} password={viewKeyPasswordInput} setPassword={setViewKeyPasswordInput}/>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};


// --- Sub-Components ---

const AccountCard = ({ account, index, balance, revealedKey, loadingStates, onViewKey, onAirdrop, onSend, onCopy }) => {
  const isBalanceLoading=loadingStates[`balance-${account.publicKey}`];
  
  return (
    <div className="flex flex-col h-full transition-all duration-300 backpack-card">
      <div className="flex items-center justify-between p-4">
        <h3 className="font-bold text-white">Account #{index + 1}</h3>
        {/* {getNetworkIcon(account.publicKey)} */}
      </div>
      <div className="h-px bg-border-color" />
      <div className="flex flex-col items-center justify-center flex-grow p-6 text-center">
        <div className="text-4xl font-bold text-white">
          {isBalanceLoading ? <LoaderCircle size={36} className="animate-spin text-brand-red" /> : `${balance} SOL` || '...'}
        </div>
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-400">
          <span>{truncateAddress(account.publicKey)}</span>
          <Copy size={14} className="cursor-pointer shrink-0 hover:text-white" onClick={()=>onCopy(account.publicKey)} />
        </div>
      </div>
      <div className="h-px bg-border-color" />
      <div className="flex items-center justify-around p-3">
        <ActionButton icon={<Send size={20} />} label="Send" onClick={onSend} />
        <ActionButton icon={<Droplets size={20} />} label="Airdrop" onClick={onAirdrop} />
        <ActionButton icon={<KeyRound size={20} />} label={revealedKey ? 'Hide' : 'Key'} onClick={onViewKey} isDanger={true} />
      </div>
      {revealedKey && (
        <div className="p-3 mx-4 mb-4 text-xs bg-black/50 rounded-lg border-l-2 border-brand-red">
          <div className="flex items-center justify-between">
            <span className="font-bold text-brand-red">PRIVATE KEY</span>
            <Copy size={14} className="cursor-pointer hover:text-white" onClick={()=>onCopy(revealedKey)} />
          </div>
          <p className="mt-2 break-all text-gray-300">{revealedKey}</p>
        </div>
      )}
    </div>
  );
};

const ActionButton = ({ icon, label, onClick, disabled, isDanger }) => (
  <button onClick={onClick} disabled={disabled} className={`flex flex-col items-center gap-1 p-2 rounded-lg w-16 transition-colors text-gray-300 hover:bg-gray-700/50 disabled:opacity-50 disabled:cursor-not-allowed ${isDanger ? 'hover:text-brand-red' : 'hover:text-white'}`}>
    {icon}
    <span className="text-xs">{label}</span>
  </button>
);

const AirdropConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading, account }) => {
    if(!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-sm p-6 text-center backpack-card">
                <div className="flex justify-center mb-4"><Droplets size={40} className="text-brand-red"/></div>
                <h2 className="text-xl font-bold text-white">Confirm Airdrop</h2>
                <p className="mt-2 text-sm text-gray-400">You are about to airdrop <span className="font-bold text-white">1 SOL</span> to the following account:</p>
                <p className="px-4 py-2 mt-4 text-xs text-gray-300 break-all bg-black/50 rounded-md">{account?.publicKey}</p>
                <div className="flex justify-center gap-4 mt-6">
                    <button onClick={onClose} disabled={isLoading} className="w-full px-4 py-2 text-sm font-semibold bg-gray-600 rounded-lg hover:bg-gray-500 disabled:opacity-50">Cancel</button>
                    <button onClick={onConfirm} disabled={isLoading} className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white rounded-lg backpack-button disabled:opacity-50">{isLoading ? <LoaderCircle size={20} className="animate-spin"/> : 'Confirm'}</button>
                </div>
            </div>
        </div>
    );
};

const CreateAccountModal = ({ isOpen, onClose, onConfirm, isLoading, password, setPassword }) => {
    if(!isOpen) return null;
    const handleSubmit = (e) => { e.preventDefault(); onConfirm(); };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-sm p-6 backpack-card">
                <div className="flex justify-center mb-4"><Plus size={40} className="p-2 rounded-full text-brand-red bg-brand-red/20"/></div>
                <h2 className="text-xl font-bold text-center text-white">Create New Account</h2>
                <p className="mt-2 text-sm text-center text-gray-400">Confirm your wallet password to authorize this action.</p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500"/>
                        <input id="password" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full pl-12 pr-4 py-3 text-sm rounded-lg backpack-input" required/>
                    </div>
                    <div className="flex justify-center gap-4">
                        <button type="button" onClick={onClose} disabled={isLoading} className="w-full px-4 py-2 text-sm font-semibold bg-gray-600 rounded-lg hover:bg-gray-500 disabled:opacity-50">Cancel</button>
                        <button type="submit" disabled={isLoading||!password} className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white rounded-lg backpack-button disabled:opacity-50">{isLoading ? <LoaderCircle size={20} className="animate-spin"/> : 'Confirm Create'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const SendSolModal = ({ isOpen, onClose, onConfirm, isLoading, fromAccount, formState, setFormState }) => {
    if (!isOpen) return null;
    const handleInputChange = (e) => { const { name, value } = e.target; setFormState(prev => ({ ...prev, [name]: value })); };
    const handleSubmit = (e) => { e.preventDefault(); onConfirm(); };
    const isConfirmDisabled = isLoading || !formState.toPublicKey || !formState.amount || !formState.password;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-md p-6 backpack-card">
                <div className="flex items-center justify-center mb-4"><Send size={40} className="p-2 rounded-full text-brand-red bg-brand-red/20" /></div>
                <h2 className="text-xl font-bold text-center text-white">Send SOL</h2>
                <div className="p-2 mt-2 text-xs text-center text-gray-400 bg-black/50 rounded-md">Sending from: <span className="font-semibold text-gray-200">{truncateAddress(fromAccount?.publicKey)}</span></div>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="relative"><UserSquare className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" /><input name="toPublicKey" type="text" placeholder="Recipient's SOL Address" value={formState.toPublicKey} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 text-sm rounded-lg backpack-input" required/></div>
                    <div className="relative"><Coins className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" /><input name="amount" type="number" step="any" min="0" placeholder="Amount in SOL" value={formState.amount} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 text-sm rounded-lg backpack-input" required/></div>
                    <div className="relative"><Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" /><input name="password" type="password" placeholder="Your Password" value={formState.password} onChange={handleInputChange} className="w-full pl-12 pr-4 py-3 text-sm rounded-lg backpack-input" required/></div>
                    <div className="flex justify-center gap-4 pt-2">
                        <button type="button" onClick={onClose} disabled={isLoading} className="w-full px-4 py-2 text-sm font-semibold bg-gray-600 rounded-lg hover:bg-gray-500 disabled:opacity-50">Cancel</button>
                        <button type="submit" disabled={isConfirmDisabled} className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white rounded-lg backpack-button disabled:opacity-50">{isLoading ? <LoaderCircle size={20} className="animate-spin" /> : 'Confirm Send'}</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const ViewKeyModal = ({ isOpen, onClose, onConfirm, isLoading, password, setPassword }) => {
    if (!isOpen) return null;
    const handleSubmit = (e) => { e.preventDefault(); onConfirm(); };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
            <div className="w-full max-w-sm p-6 backpack-card">
                <div className="flex justify-center mb-4"><KeyRound size={40} className="p-2 rounded-full text-brand-red bg-brand-red/20" /></div>
                <h2 className="text-xl font-bold text-center text-white">Reveal Private Key</h2>
                <p className="mt-2 text-sm text-center text-gray-400">
                    Enter your password to view the private key. This is a sensitive action.
                </p>
                <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                    <div className="relative">
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                        <input
                            id="view-key-password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 text-sm rounded-lg backpack-input"
                            required
                        />
                    </div>
                    <div className="flex justify-center gap-4">
                        <button type="button" onClick={onClose} disabled={isLoading} className="w-full px-4 py-2 text-sm font-semibold bg-gray-600 rounded-lg hover:bg-gray-500 disabled:opacity-50">Cancel</button>
                        <button type="submit" disabled={isLoading || !password} className="flex items-center justify-center w-full px-4 py-2 text-sm font-semibold text-white rounded-lg backpack-button disabled:opacity-50">
                            {isLoading ? <LoaderCircle size={20} className="animate-spin" /> : 'Confirm'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

const Toast = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 4000);
        return () => clearTimeout(timer);
    }, [onClose]);

    const isSuccess = type === 'success';
    const bgColor = isSuccess ? 'bg-green-500/20' : 'bg-brand-red/20';
    const borderColor = isSuccess ? 'border-green-500' : 'border-brand-red';
    const textColor = isSuccess ? 'text-green-300' : 'text-red-300';
    const Icon = isSuccess ? CheckCircle : XCircle;

    return (
        <div className={`fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 px-4 py-3 text-sm rounded-lg border shadow-xl ${bgColor} ${borderColor} ${textColor}`}>
            <Icon size={20}/>
            <span>{message}</span>
            <button onClick={onClose} className="absolute -top-1 -right-1">
                <X size={14} className="p-0.5 bg-gray-800 rounded-full"/>
            </button>
        </div>
    );
};

const SkeletonLoader = () => (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col h-full backpack-card animate-pulse">
                <div className="flex items-center justify-between p-4">
                    <div className="w-24 h-5 bg-gray-700 rounded-md"></div>
                    <div className="w-6 h-6 bg-gray-700 rounded-full"></div>
                </div>
                <div className="h-px bg-border-color"/>
                <div className="flex flex-col items-center justify-center flex-grow p-6">
                    <div className="w-32 h-10 bg-gray-700 rounded-md"></div>
                    <div className="w-24 h-4 mt-4 bg-gray-700 rounded-md"></div>
                </div>
                <div className="h-px bg-border-color"/>
                <div className="flex items-center justify-around p-3">
                    <div className="w-12 h-10 bg-gray-700 rounded-md"></div>
                    <div className="w-12 h-10 bg-gray-700 rounded-md"></div>
                    <div className="w-12 h-10 bg-gray-700 rounded-md"></div>
                </div>
            </div>
        ))}
    </div>
);

const EmptyState = ({ onCreate }) => (
    <div className="flex flex-col items-center justify-center py-20 text-center border-2 border-dashed rounded-lg border-border-color">
        <Wallet size={48} className="text-gray-600"/>
        <h3 className="mt-4 text-xl font-bold text-white">No Accounts Found</h3>
        <p className="mt-2 text-sm text-gray-400">Get started by creating your first account.</p>
        <button onClick={onCreate} className="flex items-center gap-2 px-5 py-2 mt-6 text-sm rounded-lg backpack-button">
            <Plus size={16} />
            Create Your First Account
        </button>
    </div>
);

export default DashboardPage;
