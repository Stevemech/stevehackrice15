import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reportAPI } from '../services/api';
import { addXP, XP_REWARDS } from '../utils/xpManager';
import '../styles/DailyReport.css';

interface ReportField {
  id: string;
  label: string;
  type: 'text' | 'number' | 'textarea' | 'select';
  required: boolean;
  options?: string[];
  value: string | number;
}

const DailyReport: React.FC = () => {
  const navigate = useNavigate();
  const [reportData, setReportData] = useState<Record<string, any>>({
    patientsVisited: '',
    vaccinationsGiven: '',
    healthEducation: '',
    challenges: '',
    notes: ''
  });

  const handleInputChange = (fieldId: string, value: any) => {
      // For number fields, validate that the value is not negative
      if ((fieldId === 'patientsVisited' || fieldId === 'vaccinationsGiven') && value !== '') {
        const numValue = parseInt(value);
        if (numValue < 0) {
          return; // Don't update state if negative
        }
      }
    
    setReportData(prev => ({
      ...prev,
      [fieldId]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Prepare the report data with current date
      const reportToSubmit = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0], // Format as YYYY-MM-DD
        timestamp: new Date().toISOString(),
        patientsVisited: parseInt(reportData.patientsVisited) || 0,
        vaccinationsGiven: parseInt(reportData.vaccinationsGiven) || 0,
        healthEducation: reportData.healthEducation,
        challenges: reportData.challenges,
        notes: reportData.notes
      };
      
      // Submit to backend
      await reportAPI.createReport(reportToSubmit);
      
      console.log('Report submitted successfully:', reportToSubmit);
      
      // Add XP for submitting report
      addXP(XP_REWARDS.DAILY_REPORT, 'Submitted daily report');
      
      // Store in localStorage as backup
      const existingReports = JSON.parse(localStorage.getItem('dailyReports') || '[]');
      existingReports.push(reportToSubmit);
      localStorage.setItem('dailyReports', JSON.stringify(existingReports));
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Error submitting report:', error);
      
      // Fallback: Store locally if backend fails
      const reportToSubmit = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        timestamp: new Date().toISOString(),
        patientsVisited: parseInt(reportData.patientsVisited) || 0,
        vaccinationsGiven: parseInt(reportData.vaccinationsGiven) || 0,
        healthEducation: reportData.healthEducation,
        challenges: reportData.challenges,
        notes: reportData.notes
      };
      
      const existingReports = JSON.parse(localStorage.getItem('dailyReports') || '[]');
      existingReports.push(reportToSubmit);
      localStorage.setItem('dailyReports', JSON.stringify(existingReports));
      
      // Still add XP even if backend fails
      addXP(XP_REWARDS.DAILY_REPORT, 'Submitted daily report (saved locally)');
      navigate('/dashboard');
    }
  };

  const reportFields: ReportField[] = [
    {
      id: 'patientsVisited',
      label: 'Number of Patients Visited',
      type: 'number',
      required: true,
      value: reportData.patientsVisited
    },
    {
      id: 'vaccinationsGiven',
      label: 'Vaccinations Administered',
      type: 'number',
      required: true,
      value: reportData.vaccinationsGiven
    },
    {
      id: 'healthEducation',
      label: 'Health Education Topics Covered',
      type: 'select',
      required: true,
      options: ['Hygiene', 'Nutrition', 'Disease Prevention', 'Maternal Health', 'Child Care'],
      value: reportData.healthEducation
    },
    {
      id: 'challenges',
      label: 'Challenges Faced',
      type: 'textarea',
      required: false,
      value: reportData.challenges
    },
    {
      id: 'notes',
      label: 'Additional Notes',
      type: 'textarea',
      required: false,
      value: reportData.notes
    }
  ];

  return (
    <div className="daily-report">
      <header className="report-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ←
        </button>
        <h1>Daily Report</h1>
        <span className="date">{new Date().toLocaleDateString()}</span>
      </header>

      <div className="report-intro">
        <p>📝 Fill out your daily report to track your activities and earn XP!</p>
      </div>

      <form className="report-form" onSubmit={handleSubmit}>
        {reportFields.map(field => (
          <div key={field.id} className="form-field">
            <label htmlFor={field.id}>
              {field.label}
              {field.required && <span className="required"> *</span>}
            </label>
            
            {field.type === 'textarea' ? (
              <textarea
                id={field.id}
                value={field.value}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                required={field.required}
                rows={4}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
              />
            ) : field.type === 'select' ? (
              <select
                id={field.id}
                value={field.value}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                required={field.required}
              >
                <option value="">Select an option</option>
                {field.options?.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <input
                type={field.type}
                id={field.id}
                value={field.value}
                onChange={(e) => handleInputChange(field.id, e.target.value)}
                required={field.required}
                placeholder={`Enter ${field.label.toLowerCase()}...`}
              />
            )}
          </div>
        ))}

        <div className="form-actions">
          <button type="button" className="secondary-btn" onClick={() => navigate('/dashboard')}>
            Cancel
          </button>
          <button type="submit" className="primary-btn">
            Submit Report
          </button>
        </div>
      </form>

      <div className="report-stats">
        <h3>Your Stats Today</h3>
        <div className="stats-grid">
          <div className="stat">
            <span className="stat-icon">📍</span>
            <span className="stat-value">5</span>
            <span className="stat-label">Locations Visited</span>
          </div>
          <div className="stat">
            <span className="stat-icon">⏱️</span>
            <span className="stat-value">6h</span>
            <span className="stat-label">Active Hours</span>
          </div>
          <div className="stat">
            <span className="stat-icon">💎</span>
            <span className="stat-value">+150</span>
            <span className="stat-label">XP Earned</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyReport;