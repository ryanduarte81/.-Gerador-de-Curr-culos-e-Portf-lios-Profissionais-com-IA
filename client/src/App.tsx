import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import ResumeBuilder from './components/ResumeBuilder';
import ATSAnalyzer from './components/ATSAnalyzer';
import JobMatcher from './components/JobMatcher';
import Templates from './components/Templates';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<ResumeBuilder />} />
            <Route path="/ats-analyzer" element={<ATSAnalyzer />} />
            <Route path="/job-matcher" element={<JobMatcher />} />
            <Route path="/templates" element={<Templates />} />
          </Routes>
        </main>
        <Toaster 
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
          }}
        />
      </div>
    </Router>
  );
}

export default App; 