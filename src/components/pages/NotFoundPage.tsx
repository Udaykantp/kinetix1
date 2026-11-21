import React from 'react';
import { Zap, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';

export const NotFoundPage: React.FC = () => {
  const { navigate } = useStore();

  return (
    <div className="bg-[#17191C] min-h-[70vh] flex items-center justify-center py-20 px-4 text-center">
      <div className="max-w-md bg-[#101214] border border-[#25282D] rounded-2xl p-10 space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#D6B98C]/10 border border-[#D6B98C]/30 flex items-center justify-center mx-auto text-[#D6B98C]">
          <Zap className="w-8 h-8" />
        </div>
        <div className="font-mono text-3xl font-bold text-[#F2F0EA]">404</div>
        <h1 className="text-xl font-bold text-[#F2F0EA]">Circuit Disconnected</h1>
        <p className="text-xs text-[#8E959E] leading-relaxed">
          The requested battery specification or resource page could not be located on the power grid.
        </p>
        <button
          onClick={() => navigate('home')}
          className="mt-4 px-6 py-3 bg-[#D6B98C] text-[#17191C] font-semibold text-xs rounded-lg inline-flex items-center gap-2"
        >
          <span>Return to Storefront</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
