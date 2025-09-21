import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addXP, XP_REWARDS } from '../utils/xpManager';
import '../styles/Itinerary.css';

interface Location {
  id: string;
  name: string;
  address: string;
  time: string;
  type: 'household' | 'clinic' | 'school' | 'community';
  patients: number;
  status: 'pending' | 'in-progress' | 'completed';
  distance?: string;
  notes?: string;
}

const Itinerary: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [locations, setLocations] = useState<Location[]>([
    {
      id: '1',
      name: 'Kajiado County Hospital',
      address: 'Kajiado Town',
      time: '9:00 AM',
      type: 'clinic',
      patients: 15,
      status: 'completed',
      distance: '0.5 km',
      notes: 'Vaccination clinic'
    },
    {
      id: '2',
      name: 'Mama Nasieku\'s House',
      address: 'House 12, Bissil',
      time: '11:00 AM',
      type: 'household',
      patients: 1,
      status: 'pending',
      distance: '5.8 km',
      notes: 'Postnatal checkup'
    },
    {
      id: '3',
      name: 'Kajiado Primary School',
      address: 'Education Road, Kajiado',
      time: '2:00 PM',
      type: 'school',
      patients: 30,
      status: 'pending',
      distance: '1.5 km',
      notes: 'Health education session'
    },
    {
      id: '4',
      name: 'Maasai Community Hall',
      address: 'Kajiado Community Center',
      time: '4:00 PM',
      type: 'community',
      patients: 25,
      status: 'pending',
      distance: '2.0 km',
      notes: 'Nutrition workshop'
    }
  ]);

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'household': return '🏠';
      case 'clinic': return '🏥';
      case 'school': return '🏫';
      case 'community': return '👥';
      default: return '📍';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10B981';
      case 'in-progress': return '#F59E0B';
      case 'pending': return '#6B7280';
      default: return '#6B7280';
    }
  };

  const handleLocationClick = (location: Location) => {
    setSelectedLocation(location);
  };

  const handleCheckIn = () => {
    if (!selectedLocation) return;
    
    // Find the current location index
    const currentIndex = locations.findIndex(loc => loc.id === selectedLocation.id);
    
    // Update the current location to in-progress
    const updatedLocations = locations.map((loc, index) => {
      if (loc.id === selectedLocation.id) {
        return { ...loc, status: 'in-progress' as const };
      }
      // Mark previous locations as completed if they were pending
      if (index < currentIndex && loc.status === 'pending') {
        return { ...loc, status: 'completed' as const };
      }
      return loc;
    });
    
    setLocations(updatedLocations);
    
    // Add XP for check-in
    addXP(XP_REWARDS.CHECK_IN, `Checked in at ${selectedLocation.name}`);
    
    // Clear selection after check-in
    setSelectedLocation(null);
    
    // Save check-in to localStorage for persistence
    const checkIns = JSON.parse(localStorage.getItem('checkIns') || '[]');
    checkIns.push({
      locationId: selectedLocation.id,
      locationName: selectedLocation.name,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString()
    });
    localStorage.setItem('checkIns', JSON.stringify(checkIns));
  };

  const handleCompleteVisit = () => {
    if (!selectedLocation) return;
    
    // Update the location to completed
    const updatedLocations = locations.map(loc => {
      if (loc.id === selectedLocation.id) {
        return { ...loc, status: 'completed' as const };
      }
      return loc;
    });
    
    setLocations(updatedLocations);
    
    // Add XP for completing visit
    addXP(XP_REWARDS.COMPLETE_VISIT, `Completed visit at ${selectedLocation.name}`);
    
    // Clear selection
    setSelectedLocation(null);
    
    // Save completion to localStorage
    const completions = JSON.parse(localStorage.getItem('completedVisits') || '[]');
    completions.push({
      locationId: selectedLocation.id,
      locationName: selectedLocation.name,
      timestamp: new Date().toISOString(),
      date: new Date().toLocaleDateString(),
      patients: selectedLocation.patients
    });
    localStorage.setItem('completedVisits', JSON.stringify(completions));
  };

  return (
    <div className="itinerary">
      <header className="itinerary-header">
        <button className="back-btn" onClick={() => navigate('/dashboard')}>
          ←
        </button>
        <h1>Daily Itinerary</h1>
        <button className="map-view-btn" onClick={() => navigate('/map')}>
          🗺️
        </button>
      </header>

      <div className="date-section">
        <h3>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h3>
        <p className="summary">📍 {locations.length} locations • 👥 {locations.reduce((sum, loc) => sum + loc.patients, 0)} patients</p>
      </div>

      <div className="timeline">
        {locations.map((location, index) => (
          <div key={location.id} className="timeline-item">
            <div className="timeline-marker" style={{ backgroundColor: getStatusColor(location.status) }}>
              {location.status === 'completed' && '✓'}
            </div>
            {index < locations.length - 1 && <div className="timeline-line" />}
            
            <div 
              className={`location-card ${location.status}`}
              onClick={() => handleLocationClick(location)}
            >
              <div className="location-time">
                <span>{location.time}</span>
              </div>
              
              <div className="location-content">
                <div className="location-header">
                  <span className="location-icon">{getLocationIcon(location.type)}</span>
                  <div className="location-info">
                    <h3>{location.name}</h3>
                    <p className="address">{location.address}</p>
                  </div>
                </div>
                
                <div className="location-meta">
                  <span className="meta-item">
                    <span className="icon">👥</span> {location.patients} patients
                  </span>
                  {location.distance && (
                    <span className="meta-item">
                      <span className="icon">📏</span> {location.distance}
                    </span>
                  )}
                </div>
                
                {location.notes && (
                  <div className="location-notes">
                    📝 {location.notes}
                  </div>
                )}
                
                <div className="location-status" style={{ color: getStatusColor(location.status) }}>
                  {location.status === 'completed' && '✅ Completed'}
                  {location.status === 'in-progress' && '⏳ In Progress'}
                  {location.status === 'pending' && '⏰ Pending'}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedLocation && (
        <div className="action-panel">
          {selectedLocation.status === 'pending' && (
            <button className="check-in-btn" onClick={handleCheckIn}>
              📍 Check In at {selectedLocation.name}
            </button>
          )}
          {selectedLocation.status === 'in-progress' && (
            <button className="complete-btn" onClick={handleCompleteVisit}>
              ✅ Complete Visit at {selectedLocation.name}
            </button>
          )}
          {selectedLocation.status === 'completed' && (
            <div className="completed-message">
              ✓ Visit completed at {selectedLocation.name}
            </div>
          )}
        </div>
      )}

      <div className="itinerary-stats">
        <h3>Today's Progress</h3>
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${(locations.filter(l => l.status === 'completed').length / locations.length) * 100}%` 
            }}
          ></div>
        </div>
        <p className="progress-text">
          {locations.filter(l => l.status === 'completed').length} of {locations.length} locations completed
        </p>
        {locations.filter(l => l.status === 'in-progress').length > 0 && (
          <p className="in-progress-text">
            {locations.filter(l => l.status === 'in-progress').length} location in progress
          </p>
        )}
      </div>
    </div>
  );
};

export default Itinerary;