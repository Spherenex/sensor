import React, { useState, useEffect } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue } from "firebase/database";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './App.css';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBGvhE5d797L-I63rQz9nN8HbkLg0keahU",
  authDomain: "spherenex-1c0a4.firebaseapp.com",
  databaseURL: "https://spherenex-1c0a4-default-rtdb.firebaseio.com",
  projectId: "spherenex-1c0a4",
  storageBucket: "spherenex-1c0a4.firebasestorage.app",
  messagingSenderId: "371635296796",
  appId: "1:371635296796:web:6a9845e68f8d296e5bddd9",
  measurementId: "G-P36RZB6674"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

const SensorDashboard = () => {
  // State for sensor data
  const [sensorData, setSensorData] = useState({
    // Sensors group
    current: { value: "0", history: [] },
    humidity: { value: "0", history: [] },
    noise: { value: "0", history: [] },
    temperature: { value: "0", history: [] },
    vibration: { value: "0", history: [] },
    
    // Lights group
    lightsHumidity: { value: 0, history: [] },
    lightsTemperature: { value: 0, history: [] },
    timestamp: "0"
  });
  
  // Set up Firebase real-time listeners
  useEffect(() => {
    const currentTime = () => new Date().toLocaleTimeString();
    
    // Listen for changes to the Sensors node
    const sensorsRef = ref(database, 'Sensors');
    const sensorsListener = onValue(sensorsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSensorData(prevData => {
          const newData = {...prevData};
          
          // Update all sensor values and their history
          if (data.Current !== undefined) {
            const value = data.Current;
            newData.current = {
              value: value,
              history: [...(prevData.current.history || []), {
                value: parseFloat(value),
                time: currentTime()
              }]
            };
          }
          
          if (data.Humidity !== undefined) {
            const value = data.Humidity;
            newData.humidity = {
              value: value,
              history: [...(prevData.humidity.history || []), {
                value: parseFloat(value),
                time: currentTime()
              }]
            };
          }
          
          if (data.Noise !== undefined) {
            const value = data.Noise;
            newData.noise = {
              value: value,
              history: [...(prevData.noise.history || []), {
                value: parseFloat(value),
                time: currentTime()
              }]
            };
          }
          
          if (data.Temperature !== undefined) {
            const value = data.Temperature;
            newData.temperature = {
              value: value,
              history: [...(prevData.temperature.history || []), {
                value: parseFloat(value),
                time: currentTime()
              }]
            };
          }
          
          if (data.Vibration !== undefined) {
            const value = data.Vibration;
            newData.vibration = {
              value: value,
              history: [...(prevData.vibration.history || []), {
                value: parseFloat(value),
                time: currentTime()
              }]
            };
          }
          
          return newData;
        });
      }
    });
    
    // Listen for changes to the lights node
    const lightsRef = ref(database, 'lights');
    const lightsListener = onValue(lightsRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        setSensorData(prevData => {
          const newData = {...prevData};
          
          if (data.humidity !== undefined) {
            const value = data.humidity;
            newData.lightsHumidity = {
              value: value,
              history: [...(prevData.lightsHumidity.history || []), {
                value: value,
                time: currentTime()
              }]
            };
          }
          
          if (data.temperature !== undefined) {
            const value = data.temperature;
            newData.lightsTemperature = {
              value: value,
              history: [...(prevData.lightsTemperature.history || []), {
                value: value,
                time: currentTime()
              }]
            };
          }
          
          if (data.timestamp !== undefined) {
            newData.timestamp = data.timestamp;
          }
          
          return newData;
        });
      }
    });
    
    // Clean up listeners on unmount
    return () => {
      sensorsListener();
      lightsListener();
    };
  }, []);

  // Keep only last 10 history items for each sensor
  useEffect(() => {
    setSensorData(prevData => {
      const newData = {...prevData};
      
      // Trim history arrays to last 10 items
      Object.keys(newData).forEach(key => {
        if (newData[key] && newData[key].history && newData[key].history.length > 10) {
          newData[key].history = newData[key].history.slice(-10);
        }
      });
      
      return newData;
    });
  }, [sensorData]);

  // Configuration for sensor cards
  const sensorConfig = [
    {
      id: 'current',
      label: 'Current',
      unit: 'A',
      color: '#4287f5',
      group: 'Sensors'
    },
    {
      id: 'humidity',
      label: 'Humidity',
      unit: '%',
      color: '#1fb978',
      group: 'Sensors'
    },
    {
      id: 'noise',
      label: 'Noise',
      unit: 'dB',
      color: '#f54242',
      group: 'Sensors'
    },
    {
      id: 'temperature',
      label: 'Temperature',
      unit: '°C',
      color: '#a367dc',
      group: 'Sensors'
    },
    {
      id: 'vibration',
      label: 'Vibration',
      unit: 'Hz',
      color: '#f59c42',
      group: 'Sensors'
    },
    {
      id: 'lightsHumidity',
      label: 'Lights Humidity',
      unit: '%',
      color: '#42b6f5',
      group: 'Lights'
    },
    {
      id: 'lightsTemperature',
      label: 'Lights Temperature',
      unit: '°C',
      color: '#f542c8',
      group: 'Lights'
    }
  ];

  return (
    <div className="dashboard">
      <h1 className="dashboard-title">Sensor Dashboard</h1>
      
      <div className="metric-cards">
        {sensorConfig.map(sensor => (
          <div className="metric-card" key={sensor.id}>
            <div className="metric-header" style={{ backgroundColor: sensor.color }}>
              <div className="metric-icon"></div>
              <span className="metric-label">{sensor.label}</span>
            </div>
            <div className="metric-body">
              <div className="metric-value">
                {sensorData[sensor.id]?.value || 0}
              </div>
              <div className="metric-unit">{sensor.unit}</div>
            </div>
          </div>
        ))}
        
        <div className="metric-card">
          <div className="metric-header" style={{ backgroundColor: '#718096' }}>
            <div className="metric-icon"></div>
            <span className="metric-label">Timestamp</span>
          </div>
          <div className="metric-body">
            <div className="metric-value">{sensorData.timestamp}</div>
            <div className="metric-unit"></div>
          </div>
        </div>
      </div>
      
      <div className="charts-container">
        {sensorConfig.map(sensor => (
          <div className="chart-card" key={`chart-${sensor.id}`}>
            <h2 className="chart-title">{sensor.label} History</h2>
            <div className="chart-container">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={sensorData[sensor.id]?.history || []}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" tick={{ fontSize: 12 }} />
                  <YAxis domain={['auto', 'auto']} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke={sensor.color} 
                    dot={{ fill: sensor.color, r: 4 }}
                    isAnimationActive={true}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SensorDashboard;