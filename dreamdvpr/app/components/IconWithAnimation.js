import React from 'react';

const IconWithAnimation = ({ icon, className = '' }) => {
    return (
        <div className={`p-4 rounded-2xl bg-gradient-to-br from-white to-white/50 shadow-sm border border-white/60 inline-flex items-center justify-center transform transition-transform duration-500 hover:scale-110 group ${className}`}>
            <div className="text-[#00abad] w-8 h-8 md:w-10 md:h-10 transition-transform duration-500 group-hover:rotate-12">
                {icon}
            </div>
        </div>
    );
};

export default IconWithAnimation;
