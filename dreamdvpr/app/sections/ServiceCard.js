import React from 'react';
import GlassCard from '../components/GlassCard';
import IconWithAnimation from '../components/IconWithAnimation';

const ServiceCard = ({ title, description, icon, iconColor, className = '' }) => {
    return (
        <GlassCard className={`flex flex-col justify-between group hover:bg-white/60 transition-colors duration-500 ${className}`}>
            <div className={`w-12 h-12 md:w-16 md:h-16 mb-6 ${iconColor || 'text-[#00abad]'} transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6`}>
                {icon}
            </div>
            <div>
                <h3 className="text-xl md:text-2xl font-bold text-[#1d1d1f] mb-2 group-hover:text-[#00abad] transition-colors">
                    {title}
                </h3>
                <p className="text-gray-500 leading-relaxed text-sm md:text-base">
                    {description}
                </p>
            </div>
        </GlassCard>
    );
};

export default ServiceCard;
