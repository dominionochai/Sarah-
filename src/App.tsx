/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavigationPath } from './types/index.ts';
import { Header } from './components/Header.tsx';
import { Sidebar } from './components/Sidebar.tsx';
import { HelpModal } from './components/HelpModal.tsx';
import { InvestorDeckModal } from './components/InvestorDeckModal.tsx';
import { Toast } from './components/Toast.tsx';
import { VerifyModule } from './components/modules/VerifyModule.tsx';
import { VoiceModule } from './components/modules/VoiceModule.tsx';
import { BrainModule } from './components/modules/BrainModule.tsx';
import { HandsModule } from './components/modules/HandsModule.tsx';
import { NetworkModule } from './components/modules/NetworkModule.tsx';
import { EyesModule } from './components/modules/EyesModule.tsx';
import { OverviewModule } from './components/modules/OverviewModule.tsx';

export default function App() {
  const [currentPath, setCurrentPath] = useState<NavigationPath>('overview');
  const [language, setLanguage] = useState<'EN' | 'SW'>('EN');
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [isInvestorDeckOpen, setIsInvestorDeckOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  const handleToggleLanguage = () => {
    const nextLang = language === 'EN' ? 'SW' : 'EN';
    setLanguage(nextLang);
    showToast(
      nextLang === 'SW'
        ? 'Lugha imebadilishwa kuwa Kiswahili (Swahili Corridor)'
        : 'Language switched to English (Primary Locale)'
    );
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen font-body-md text-body-md antialiased selection:bg-primary-container selection:text-on-primary-container">
      {/* Top Header */}
      <Header
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onOpenHelp={() => setIsHelpOpen(true)}
        onOpenInvestorDeck={() => setIsInvestorDeckOpen(true)}
        syncTimeText="14m ago"
      />

      {/* Left Sidebar */}
      <Sidebar
        currentPath={currentPath}
        onNavigate={(path) => {
          setCurrentPath(path);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        syncTimeText="14m ago"
      />

      {/* Main Content Area */}
      <div className="pl-[230px]">
        <main className="relative pt-[72px] min-h-screen bg-surface w-full p-8 font-body-md text-body-md text-on-surface">
          {currentPath === 'overview' && (
            <OverviewModule
              onNavigate={(path) => setCurrentPath(path)}
              onShowToast={showToast}
              onOpenInvestorDeck={() => setIsInvestorDeckOpen(true)}
            />
          )}

          {currentPath === 'verify' && (
            <VerifyModule onShowToast={showToast} />
          )}

          {currentPath === 'voice' && (
            <VoiceModule onShowToast={showToast} />
          )}

          {currentPath === 'brain' && (
            <BrainModule
              onShowToast={showToast}
              onNavigate={(path) => setCurrentPath(path)}
              onAddTaskToHands={(task) => {
                showToast(`Field Task Dispatched: ${task}`);
              }}
            />
          )}

          {currentPath === 'network' && (
            <NetworkModule
              onShowToast={showToast}
              onNavigate={(path) => setCurrentPath(path)}
            />
          )}

          {currentPath === 'hands' && (
            <HandsModule onShowToast={showToast} />
          )}

          {currentPath === 'eyes' && (
            <EyesModule
              onShowToast={showToast}
              onNavigate={(path) => setCurrentPath(path)}
            />
          )}
        </main>
      </div>

      {/* Global Modals & Notifications */}
      <HelpModal isOpen={isHelpOpen} onClose={() => setIsHelpOpen(false)} />
      <InvestorDeckModal
        isOpen={isInvestorDeckOpen}
        onClose={() => setIsInvestorDeckOpen(false)}
        onExploreModule={(module) => {
          setCurrentPath(module);
          setIsInvestorDeckOpen(false);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />
    </div>
  );
}
