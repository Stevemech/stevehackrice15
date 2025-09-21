import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import L from 'leaflet';
import { useNavigate } from 'react-router-dom';
import BottomNavigation from '../components/BottomNavigation';
import '../styles/MapView.css';

// Import Leaflet CSS - Critical for map to display correctly
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
// This is a workaround for the default marker icon issue with Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface HealthFacility {
  id: string;
  name: string;
  type: 'hospital' | 'clinic' | 'health-center';
  position: [number, number];
  servicesAvailable: string[];
  distance?: number;
}

interface ClientHouse {
  id: string;
  address: string;
  clientName: string;
  position: [number, number];
  status: 'to-visit' | 'visited' | 'scheduled';
  lastVisit?: string;
  nextVisit?: string;
  distance?: number;
  description?: string;
}

const MapView: React.FC = () => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'to-visit' | 'visited' | 'scheduled'>('all');
  const [mapReady, setMapReady] = useState(false);
  
  // Fixed location at Kajiado Airport, Kenya (no geolocation tracking)
  const defaultPosition: [number, number] = [-1.8581, 36.9823];
  
  const healthFacilities: HealthFacility[] = [
    {
      id: '1',
      name: 'Kajiado Referral Hospital',
      type: 'hospital',
      position: [-1.8522, 36.7820],
      servicesAvailable: ['Emergency', 'Maternity', 'Pediatrics', 'Surgery', 'Outpatient', 'Laboratory'],
      distance: 20.3
    },
    {
      id: '2',
      name: 'AIC Kajiado Hospital',
      type: 'hospital',
      position: [-1.8489, 36.7845],
      servicesAvailable: ['Emergency', 'Maternity', 'Pediatrics', 'Outpatient', 'X-Ray'],
      distance: 19.8
    },
    {
      id: '3',
      name: 'Kitengela Sub-County Hospital',
      type: 'hospital',
      position: [-1.4737, 36.9532],
      servicesAvailable: ['Emergency', 'Maternity', 'Surgery', 'Laboratory', 'Pharmacy'],
      distance: 42.7
    },
    {
      id: '4',
      name: 'Ongata Rongai Health Center',
      type: 'health-center',
      position: [-1.3961, 36.7619],
      servicesAvailable: ['Vaccination', 'Maternal Care', 'Outpatient', 'Family Planning'],
      distance: 55.2
    },
    {
      id: '5',
      name: 'Namanga Health Center',
      type: 'health-center',
      position: [-2.5443, 36.7869],
      servicesAvailable: ['Primary Care', 'Vaccination', 'Maternal Health', 'HIV Testing'],
      distance: 78.9
    },
    {
      id: '6',
      name: 'Kajiado Airport Dispensary',
      type: 'clinic',
      position: [-1.8595, 36.9801],
      servicesAvailable: ['Primary Care', 'Vaccination', 'Family Planning'],
      distance: 0.3
    },
    {
      id: '7',
      name: 'Ilbisil Health Center',
      type: 'hospital',
      position: [-1.9234, 36.8912],
      servicesAvailable: ['Emergency', 'Maternity', 'Outpatient', 'Laboratory'],
      distance: 11.2
    },
    {
      id: '8',
      name: 'Oloosirkon Health Center',
      type: 'clinic',
      position: [-1.7856, 36.9234],
      servicesAvailable: ['Primary Care', 'Maternal Health', 'Vaccination'],
      distance: 9.4
    }
  ];

  const clientHouses: ClientHouse[] = [
    {
      id: '1',
      address: '123 Airport Road',
      clientName: 'Selina Nkoya Family',
      position: [-1.8623, 36.9789],
      status: 'to-visit',
      distance: 0.5,
      description: 'Maternal health check-up needed'
    },
    {
      id: '2',
      address: '45 Bissil Road',
      clientName: 'Ole Sankale Household', 
      position: [-1.8712, 36.9901],
      status: 'to-visit',
      distance: 1.8,
      description: 'Child vaccination due'
    },
    {
      id: '3',
      address: '78 Mashuuru Village',
      clientName: 'Grace Nasieku',
      position: [-1.8753, 36.8201],
      status: 'visited',
      lastVisit: '2 days ago',
      distance: 16.7,
      description: 'Follow-up completed'
    },
    {
      id: '4',
      address: '22 Kajiado Town',
      clientName: 'David Lekishon Family',
      position: [-1.8512, 36.7798],
      status: 'scheduled',
      nextVisit: 'Tomorrow 10:00 AM',
      distance: 20.1,
      description: 'Family planning consultation'
    },
    {
      id: '5',
      address: '56 Ilbisil Village',
      clientName: 'Sarah Entito',
      position: [-1.9289, 36.8956],
      status: 'visited',
      lastVisit: '1 week ago',
      distance: 11.8,
      description: 'Diabetes monitoring completed'
    },
    {
      id: '6',
      address: '89 Oloosirkon Area',
      clientName: 'Peter Kisemei Household',
      position: [-1.7901, 36.9267],
      status: 'to-visit',
      distance: 9.7,
      description: 'Hypertension screening needed'
    },
    {
      id: '7',
      address: '34 Magadi Road',
      clientName: 'Mary Ole Sankale',
      position: [-1.9012, 37.0123],
      status: 'scheduled',
      nextVisit: 'Friday 2:00 PM',
      distance: 6.2,
      description: 'Prenatal care appointment'
    },
    {
      id: '8',
      address: '67 Isinya Town',
      clientName: 'Joseph Mutua Family',
      position: [-1.6734, 36.8423],
      status: 'visited',
      lastVisit: '3 days ago',
      distance: 24.3,
      description: 'Health education session completed'
    }
  ];

  useEffect(() => {
    // Set fixed position at Kajiado Airport
    setUserLocation(defaultPosition);
    
    // Mark map as ready after a small delay
    setTimeout(() => setMapReady(true), 100);
  }, []);

  const getMarkerIcon = (type: string) => {
    const iconHtml = type === 'hospital' ? '🏥' : type === 'clinic' ? '🏩' : '🏨';
    return L.divIcon({
      html: `<div style="font-size: 24px;">${iconHtml}</div>`,
      iconSize: [30, 30],
      className: 'custom-div-icon'
    });
  };

  const getClientIcon = (status: string) => {
    let color = '#F44336'; // Red for to-visit
    if (status === 'visited') color = '#4CAF50'; // Green for visited
    if (status === 'scheduled') color = '#2196F3'; // Blue for scheduled
    
    return L.divIcon({
      html: `<div style="background-color: ${color}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
      iconSize: [20, 20],
      className: 'client-marker'
    });
  };

  const filteredClients = clientHouses.filter(client => {
    const matchesSearch = client.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         client.clientName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || client.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const mapCenter = userLocation || defaultPosition;

  return (
    <div className="map-view">
      {/* Search Bar */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            type="text"
            placeholder="Find CHC Locations"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
        </div>
      </div>

      {/* Filter Buttons */}
      <div className="filter-buttons">
        <button
          className={`filter-btn ${statusFilter === 'to-visit' ? 'active' : ''}`}
          onClick={() => setStatusFilter('to-visit')}
        >
          <span className="bell-icon">🔔</span>
          To Visit
        </button>
        <button
          className={`filter-btn ${statusFilter === 'visited' ? 'active' : ''}`}
          onClick={() => setStatusFilter('visited')}
        >
          <span className="check-icon">✓</span>
          Visited
        </button>
        <button
          className={`filter-btn ${statusFilter === 'scheduled' ? 'active' : ''}`}
          onClick={() => setStatusFilter('scheduled')}
        >
          <span className="calendar-icon">📅</span>
          Scheduled
        </button>
      </div>

      <div className="map-container">
        {mapReady && mapCenter && (
          <MapContainer
            center={mapCenter}
            zoom={13}
            style={{ height: '500px', width: '100%' }}
            scrollWheelZoom={true}
            zoomControl={false}
            attributionControl={true}
            doubleClickZoom={true}
            dragging={true}
            touchZoom={true}
          >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {/* User location marker */}
          {userLocation && (
            <>
              <Marker position={userLocation}>
                <Popup>
                  <strong>Your Location</strong>
                </Popup>
              </Marker>
              <Circle
                center={userLocation}
                radius={500}
                pathOptions={{ color: 'blue', fillColor: 'lightblue', fillOpacity: 0.2 }}
              />
            </>
          )}
          
          {/* Health Facilities - Always Show */}
          {healthFacilities.map(facility => (
            <Marker
              key={`facility-${facility.id}`}
              position={facility.position}
              icon={getMarkerIcon(facility.type)}
            >
              <Popup>
                <div className="facility-popup">
                  <h3>{facility.name}</h3>
                  <p>Type: {facility.type}</p>
                  <p>Distance: {facility.distance} km</p>
                  <div className="services">
                    <strong>Services:</strong>
                    <ul>
                      {facility.servicesAvailable.map((service, idx) => (
                        <li key={idx}>{service}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
          
          {/* Client Houses */}
          {filteredClients.map(client => (
            <Marker
              key={client.id}
              position={client.position}
              icon={getClientIcon(client.status)}
            >
              <Popup>
                <div className="client-popup">
                  <h4>{client.address}</h4>
                  <p><strong>{client.clientName}</strong></p>
                  <p>Status: <span className={`status-${client.status}`}>{client.status.replace('-', ' ').toUpperCase()}</span></p>
                  <p>Distance: {client.distance} miles</p>
                  {client.lastVisit && <p>Last Visit: {client.lastVisit}</p>}
                  {client.nextVisit && <p>Next Visit: {client.nextVisit}</p>}
                  {client.description && <p>Note: {client.description}</p>}
                </div>
              </Popup>
            </Marker>
          ))}
          </MapContainer>
        )}
      </div>

      {/* Map Legend */}
      <div className="map-legend">
        <h3>Map Legend</h3>
        <div className="legend-sections">
          <div className="legend-section">
            <h4>Health Facilities</h4>
            <div className="legend-items">
              <div className="legend-item">
                <span>🏥</span> Hospital
              </div>
              <div className="legend-item">
                <span>🏩</span> Clinic
              </div>
              <div className="legend-item">
                <span>🏨</span> Health Center
              </div>
            </div>
          </div>
          <div className="legend-section">
            <h4>Client Visits</h4>
            <div className="legend-items">
              <div className="legend-item">
                <span className="legend-dot red"></span> To Visit
              </div>
              <div className="legend-item">
                <span className="legend-dot blue"></span> Scheduled
              </div>
              <div className="legend-item">
                <span className="legend-dot green"></span> Visited
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Client List */}
      <div className="client-list">
        {filteredClients.slice(0, 2).map(client => (
          <div key={client.id} className="client-item">
            <div className="client-icon">
              <span className={`status-dot status-${client.status}`}></span>
            </div>
            <div className="client-info">
              <h4>{client.address}</h4>
              <p>{client.clientName}</p>
            </div>
            <div className="client-distance">
              <span className="distance-icon">📍</span>
              <span className="distance-text">{client.distance} miles</span>
            </div>
          </div>
        ))}
      </div>
      <BottomNavigation />
    </div>
  );
};

export default MapView;