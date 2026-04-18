import { useState, useEffect } from 'react'
import io from 'socket.io-client'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './App.css'

const DefaultIcon = L.icon({
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const socket = io('http://localhost:8080');

function App() {
  const [logs, setLogs] = useState([]);
  const [status, setStatus] = useState('OFFLINE');
  const [markers, setMarkers] = useState([]);

  useEffect(() => {
    socket.on('connect', () => setStatus('ONLINE'));
    socket.on('disconnect', () => setStatus('OFFLINE'));
    socket.on('new-attack', (data) => {
      setLogs((prev) => [data, ...prev].slice(0, 10)); 
      setMarkers((prev) => [...prev, data]); 
    });
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('new-attack');
    };
  }, []);

  const downloadReport = () => {
    if (markers.length === 0) return alert("No data captured!");
    const reportData = { generated_at: new Date().toLocaleString(), total: markers.length, data: markers };
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(reportData, null, 2)], { type: 'application/json' });
    element.href = URL.createObjectURL(file);
    element.download = `IDS_REPORT_${Date.now()}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="ids-dashboard">
      <div className="scanline"></div>
      <header>
        <div className="logo-section"><h1>HONEYGRID // IDS_v1.0</h1></div>
        <div className={`status-indicator ${status.toLowerCase()}`}>SYSTEM_{status}</div>
      </header>

      <main>
        <div className="map-wrapper">
          <MapContainer center={[20, 0]} zoom={2} scrollWheelZoom={false} style={{ height: "300px", width: "100%" }}>
            <TileLayer url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png" />
            {markers.map((marker, idx) => (
              marker.coords && (
                <Marker key={idx} position={marker.coords}>
                  <Popup><div style={{ color: '#000' }}>{marker.type}<br/>{marker.ip}</div></Popup>
                </Marker>
              )
            ))}
          </MapContainer>
        </div>

        <div className="terminal">
          <div className="terminal-header">
            <div className="header-left">
              <span>LIVE_INTRUSION_FEED</span><span className="blink">_</span>
            </div>
            <button className="report-btn" onClick={downloadReport}>GENERATE_REPORT</button>
          </div>
          <div className="terminal-body">
            {logs.length === 0 ? (
              <div className="idle-msg"><p>--- NO THREATS DETECTED ---</p></div>
            ) : (
              logs.map((log, index) => (
                <div key={index} className="alert-entry" style={{ borderLeftColor: log.risk > 70 ? '#ff0000' : '#ffae00' }}>
                  <div className="alert-header">
                    <span className="severity">RISK: {log.risk}%</span>
                    <span className="timestamp">{log.time}</span>
                  </div>
                  <p className="details">IP: {log.ip} | {log.type}</p>
                  <div className="payload-box"><code>RAW: {log.payload}</code></div>
                </div>
              ))
            )}
          </div>
        </div>

        <section className="stats-panel">
          <div className="stat-card"><h3>ACTIVE_TRAPS</h3><p className="value">01</p></div>
          <div className="stat-card"><h3>TOTAL_HITS</h3><p className="value">{markers.length}</p></div>
        </section>
      </main>
    </div>
  )
}

export default App
