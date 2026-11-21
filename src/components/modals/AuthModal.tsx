import React, { useState } from 'react';
import { X, Lock, Phone, User as UserIcon, ShieldCheck, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen, signInWithGoogle } = useStore();

  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isAuthModalOpen) return null;

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    try {
      await signInWithGoogle();
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const ok = await signInWithGoogle({
        name: name.trim() || undefined,
        phone: phone.trim() || undefined,
      });
      if (ok) {
        setName('');
        setPhone('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm">
      <div className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto bg-[#101214] border border-[#25282D] rounded-2xl p-6 sm:p-8 shadow-2xl">
        <button
          onClick={() => setIsAuthModalOpen(false)}
          className="absolute top-5 right-5 p-1.5 text-[#8E959E] hover:text-[#F2F0EA] rounded-lg"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-10 h-10 rounded-full bg-[#D6B98C]/10 border border-[#D6B98C]/30 flex items-center justify-center mx-auto text-[#D6B98C] mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-[#F2F0EA]">
            {mode === 'login' ? 'Sign In to KINETIX' : 'Create Your Account'}
          </h2>
          <p className="text-xs text-[#8E959E] mt-1">
            Access order tracking, warranty certificates, wishlist, and saved addresses
          </p>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="grid grid-cols-2 gap-1 p-1 bg-[#17191C] border border-[#25282D] rounded-xl mb-5 text-xs">
          <button
            type="button"
            onClick={() => setMode('login')}
            className={`py-2 rounded-lg font-semibold transition-colors ${
              mode === 'login'
                ? 'bg-[#25282D] text-[#D6B98C]'
                : 'text-[#8E959E] hover:text-[#F2F0EA]'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setMode('register')}
            className={`py-2 rounded-lg font-semibold transition-colors ${
              mode === 'register'
                ? 'bg-[#25282D] text-[#D6B98C]'
                : 'text-[#8E959E] hover:text-[#F2F0EA]'
            }`}
          >
            New Account
          </button>
        </div>

        {/* Mode: Sign In */}
        {mode === 'login' && (
          <div className="space-y-4 text-xs">
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleGoogleSignIn}
              className="w-full min-h-[46px] py-3 px-4 bg-[#D6B98C] hover:bg-[#E3CDA7] disabled:opacity-60 text-[#17191C] font-semibold rounded-lg transition-colors flex items-center justify-center gap-2.5"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Connecting to Google...</span>
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
                    <path
                      fill="currentColor"
                      d="M21.35 11.1h-9.18v2.98h5.27c-.23 1.48-1.72 4.35-5.27 4.35-3.17 0-5.76-2.63-5.76-5.88s2.59-5.88 5.76-5.88c1.81 0 3.02.77 3.71 1.44l2.53-2.44C16.79 4.16 14.68 3.2 12.17 3.2 7.21 3.2 3.2 7.21 3.2 12.17s4.01 8.97 8.97 8.97c5.18 0 8.61-3.64 8.61-8.77 0-.59-.06-1.04-.14-1.27z"
                    />
                  </svg>
                  <span>Continue with Google</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <div className="bg-[#17191C] border border-[#25282D] rounded-xl p-3.5 space-y-2 text-[11px] text-[#8E959E]">
              <div className="flex items-center gap-2 text-[#B7BCC2]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D6B98C] shrink-0" />
                <span>Real-time order history, cancellation & return tracking</span>
              </div>
              <div className="flex items-center gap-2 text-[#B7BCC2]">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#D6B98C] shrink-0" />
                <span>Saved Home & Work fitment addresses for 1-click checkout</span>
              </div>
              <div className="flex items-center gap-2 text-[#B7BCC2]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#D6B98C] shrink-0" />
                <span>Secured by verified Google Authentication</span>
              </div>
            </div>

            <div className="text-center text-[11px] text-[#8E959E] pt-1">
              <span>First time ordering? </span>
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#D6B98C] hover:underline font-medium"
              >
                Create your profile
              </button>
              <span className="block mt-1.5 text-[10px] text-[#6F7680]">
                You can also place orders anytime as a guest during checkout.
              </span>
            </div>
          </div>
        )}

        {/* Mode: Sign Up / Create Account */}
        {mode === 'register' && (
          <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block text-[#8E959E] font-mono text-[10px] uppercase mb-1">
                Full Name *
              </label>
              <div className="relative">
                <UserIcon className="w-4 h-4 text-[#8E959E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Rohan Mehra"
                  className="w-full bg-[#17191C] border border-[#343940] text-xs text-[#F2F0EA] pl-9 pr-3 py-2.5 rounded-lg focus:outline-none focus:border-[#D6B98C]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[#8E959E] font-mono text-[10px] uppercase mb-1">
                Mobile Number (For Dispatch & Delivery Alerts)
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-[#8E959E] absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 98200 11223"
                  className="w-full bg-[#17191C] border border-[#343940] text-xs text-[#F2F0EA] pl-9 pr-3 py-2.5 rounded-lg focus:outline-none focus:border-[#D6B98C]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full min-h-[46px] py-3 px-4 bg-[#D6B98C] hover:bg-[#E3CDA7] disabled:opacity-60 text-[#17191C] font-semibold rounded-lg transition-colors mt-2 flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creating Verified Account...</span>
                </>
              ) : (
                <>
                  <span>Create Account with Google</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMode('login')}
              className="w-full text-center text-[11px] text-[#8E959E] hover:text-[#F2F0EA] pt-1"
            >
              Already have an account? Sign In
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
