import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { IncidentsPage } from './pages/IncidentsPage';
import { IncidentDetailPage } from './pages/IncidentDetailPage';
import { InfrastructurePage } from './pages/InfrastructurePage';
import { ReportsPage } from './pages/ReportsPage';
import { simulateDemoIncident } from './services/api';

const MainLayout: React.FC<{ children: React.ReactNode; onSimulateDemo: () => void }> = ({ children, onSimulateDemo }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar onSimulateDemo={onSimulateDemo} />
      <div className="flex-1 flex overflow-hidden">
        <Sidebar />
        <main className="flex-1 p-6 overflow-y-auto max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};

export const App: React.FC = () => {
  const handleSimulateDemo = async () => {
    try {
      await simulateDemoIncident('deployment_failure');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage onSimulateDemo={handleSimulateDemo} />} />
        
        <Route
          path="/dashboard"
          element={
            <MainLayout onSimulateDemo={handleSimulateDemo}>
              <DashboardPage />
            </MainLayout>
          }
        />

        <Route
          path="/incidents"
          element={
            <MainLayout onSimulateDemo={handleSimulateDemo}>
              <IncidentsPage />
            </MainLayout>
          }
        />

        <Route
          path="/incidents/:id"
          element={
            <MainLayout onSimulateDemo={handleSimulateDemo}>
              <IncidentDetailPage />
            </MainLayout>
          }
        />

        <Route
          path="/infrastructure"
          element={
            <MainLayout onSimulateDemo={handleSimulateDemo}>
              <InfrastructurePage />
            </MainLayout>
          }
        />

        <Route
          path="/reports"
          element={
            <MainLayout onSimulateDemo={handleSimulateDemo}>
              <ReportsPage />
            </MainLayout>
          }
        />

        <Route
          path="/reports/:id"
          element={
            <MainLayout onSimulateDemo={handleSimulateDemo}>
              <ReportsPage />
            </MainLayout>
          }
        />
      </Routes>
    </BrowserRouter>
  );
};
