'use client';

import { useState } from 'react';
import { AdminSidebarWrapper } from '@/app/components/AdminSidebar';
import GlassCard from '@/app/components/GlassCard';
import { useContentManagement } from '@/app/lib/content';
import { HeroSectionEditor } from './components/HeroSectionEditor';
import { ServicesSectionEditor } from './components/ServicesSectionEditor';
import { WhyChooseUsSectionEditor } from './components/WhyChooseUsSectionEditor';
import { ComparisonSectionEditor } from './components/ComparisonSectionEditor';
import { FAQSectionEditor } from './components/FAQSectionEditor';
import { CTASectionEditor } from './components/CTASectionEditor';
import { ThemeSectionEditor } from './components/ThemeSectionEditor';

/**
 * Content Management Page - Admin interface for editing homepage content
 * Refactored to use modular section editors and centralized content management
 */
export default function ContentManagementPage() {
  const [toast, setToast] = useState(null);
  const { content, setContent, loading, saving, saveContent, isAuthenticated } = useContentManagement();
  const [activeTab, setActiveTab] = useState('hero');

  const showToast = (title, description, type = 'success') => {
    setToast({ title, description, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleSave = async () => {
    const result = await saveContent(content);
    
    if (result.success) {
      showToast('Content saved', 'Homepage content has been updated successfully', 'success');
      
      // Reload after save to get fresh server-rendered content
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } else {
      showToast('Error', result.error || 'Failed to save content', 'error');
    }
  };

  const handleSectionChange = (sectionKey, sectionData) => {
    setContent({
      ...content,
      [sectionKey]: sectionData,
    });
  };

  if (!isAuthenticated || loading) {
    return (
      <AdminSidebarWrapper>
        <div className="min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-t-[#00abad] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin" />
        </div>
      </AdminSidebarWrapper>
    );
  }

  const tabs = [
    { id: 'hero', label: 'Hero Section', icon: '🎯' },
    { id: 'services', label: 'Services', icon: '⚙️' },
    { id: 'whyChooseUs', label: 'Why Choose Us', icon: '⭐' },
    { id: 'comparison', label: 'Comparison', icon: '⚖️' },
    { id: 'faq', label: 'FAQ', icon: '❓' },
    { id: 'cta', label: 'CTA Section', icon: '📢' },
    { id: 'theme', label: 'Theme', icon: '🎨' },
  ];

  return (
    <AdminSidebarWrapper>
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="flex flex-col gap-8">
          {/* Header Section */}
          <div className="flex justify-between items-start flex-wrap gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-[#00abad] p-3 rounded-xl">
                  <svg viewBox="0 0 24 24" className="w-6 h-6 text-white" fill="currentColor">
                    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold mb-1" style={{ color: '#1d1d1f' }}>
                    Content Management
                  </h1>
                  <p className="text-lg" style={{ color: '#86868b' }}>
                    Edit homepage content and sections
                  </p>
                </div>
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 bg-[#00abad] text-white rounded-lg hover:bg-[#008c8e] transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 shadow-lg hover:shadow-xl font-semibold"
            >
              {saving ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor">
                    <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  Save Changes
                </>
              )}
            </button>
          </div>

          {/* Main Content Card */}
          <GlassCard p={8} className="shadow-xl">
            {/* Tabs Navigation */}
            <div className="mb-8 border-b border-gray-200">
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-5 py-3 font-semibold transition-all duration-200 whitespace-nowrap rounded-t-lg flex items-center gap-2 ${
                      activeTab === tab.id
                        ? 'text-[#00abad] border-b-2 border-[#00abad] bg-[#00abad]/5'
                        : 'text-gray-600 hover:text-[#00abad] hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-lg">{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Panels */}
            <div className="min-h-[400px]">
              {activeTab === 'hero' && (
                <HeroSectionEditor
                  section={content.hero}
                  onChange={(section) => handleSectionChange('hero', section)}
                />
              )}

              {activeTab === 'services' && (
                <ServicesSectionEditor
                  section={content.services}
                  onChange={(section) => handleSectionChange('services', section)}
                />
              )}

              {activeTab === 'whyChooseUs' && (
                <WhyChooseUsSectionEditor
                  section={content.whyChooseUs}
                  onChange={(section) => handleSectionChange('whyChooseUs', section)}
                />
              )}

              {activeTab === 'comparison' && (
                <ComparisonSectionEditor
                  section={content.comparison}
                  onChange={(section) => handleSectionChange('comparison', section)}
                />
              )}

              {activeTab === 'faq' && (
                <FAQSectionEditor
                  section={content.faq}
                  onChange={(section) => handleSectionChange('faq', section)}
                />
              )}

              {activeTab === 'cta' && (
                <CTASectionEditor
                  section={content.cta}
                  onChange={(section) => handleSectionChange('cta', section)}
                />
              )}

              {activeTab === 'theme' && (
                <ThemeSectionEditor
                  section={content.theme}
                  onChange={(section) => handleSectionChange('theme', section)}
                />
              )}
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 px-6 py-4 rounded-lg shadow-2xl z-[3000] animate-slide-in ${
          toast.type === 'error' ? 'bg-red-50 border-2 border-red-200 text-red-700' : 'bg-green-50 border-2 border-green-200 text-green-700'
        }`}>
          <div className="flex items-center gap-3">
            {toast.type === 'error' ? (
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
            <div>
              <p className="font-bold text-base">{toast.title}</p>
              {toast.description && <p className="text-sm mt-1">{toast.description}</p>}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </AdminSidebarWrapper>
  );
}
