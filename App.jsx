import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from "firebase/app";
import { getDatabase, ref, onValue, get } from "firebase/database";
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

// Initialize Firebase - avoid re-initialization on component re-renders
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Define threshold values for each sensor type
const thresholds = {
  current: { min: 2, max: 8 },
  humidity: { min: 30, max: 70 },
  noise: { min: 30, max: 85 },
  temperature: { min: 18, max: 28 },
  vibration: { min: 10, max: 50 },
  lightsHumidity: { min: 30, max: 70 },
  lightsTemperature: { min: 18, max: 28 }
};

// Suggestions based on sensor values
// Enhanced suggestions based on sensor values
const getSuggestion = (sensorId, value, status) => {
  if (!value || value === '') return '';
  
  const numValue = parseFloat(value);
  
  if (status === 'normal') return '';
  
  if (status === 'low') {
    switch(sensorId) {
      case 'current': 
        return `Current is below ${thresholds.current.min}A. Possible causes: power supply issues, loose connections, or equipment in standby mode. Risk: Insufficient power may lead to equipment malfunction. Action: Inspect power supply unit, check all electrical connections, and verify circuit breakers are functioning properly.`;
      case 'humidity': 
        return `Humidity below ${thresholds.humidity.min}%. Possible causes: excessive heating, poor ventilation, or HVAC system issues. Risk: Low humidity can cause static electricity buildup, dry skin/respiratory issues, and damage to wooden fixtures. Action: Deploy humidifiers, reduce heating if possible, and check for air leaks that might be letting dry air in.`;
      case 'noise': 
        return `Noise levels below ${thresholds.noise.min}dB. Possible causes: equipment not operating, sound dampening materials, or sensor malfunction. Risk: Abnormally quiet environment may indicate critical equipment is not functioning. Action: Verify all systems are operational, check sensor calibration, and inspect sound dampening materials for excessive build-up.`;
      case 'temperature': 
        return `Temperature below ${thresholds.temperature.min}°C. Possible causes: HVAC failure, excessive air conditioning, or external cold weather impact. Risk: Equipment damage, occupant discomfort, and potential condensation issues. Action: Increase heating output, check for air leaks, verify thermostat settings, and ensure heating elements are functioning properly.`;
      case 'vibration': 
        return `Vibration below ${thresholds.vibration.min}Hz. Possible causes: equipment shutdown, improper installation, or dampening system issues. Risk: Insufficient vibration may indicate equipment is not operating at optimal performance. Action: Check equipment operation status, verify mounting fixtures, and ensure proper operation cycles are maintained.`;
      case 'lightsHumidity': 
        return `Lights area humidity below ${thresholds.lightsHumidity.min}%. Possible causes: excessive heat from lights drying the air or ventilation issues. Risk: Dry conditions can affect light fixture lifespan and increase dust accumulation. Action: Install localized humidifiers near lighting systems, check ventilation around lights, and consider adjusting light schedules to reduce heat buildup.`;
      case 'lightsTemperature': 
        return `Lights area temperature below ${thresholds.lightsTemperature.min}°C. Possible causes: ambient cooling affecting lights or inadequate insulation. Risk: Cold conditions may affect light performance and energy efficiency. Action: Improve insulation around lighting systems, check for cold air drafts, and verify heating system operation in lighting areas.`;
      default: 
        return `Value is below recommended threshold of ${thresholds[sensorId]?.min || 'N/A'}. Monitor the situation and investigate if this condition persists.`;
    }
  }
  
  if (status === 'high') {
    switch(sensorId) {
      case 'current': 
        return `Current exceeds ${thresholds.current.max}A. Possible causes: electrical short circuit, equipment overload, or multiple devices operating simultaneously. Risk: Fire hazard, equipment damage, and breaker trips. Action: Immediately check for hot spots in wiring, reduce electrical load, inspect for damaged insulation, and consider emergency shutdown if values continue to rise.`;
      case 'humidity': 
        return `Humidity exceeds ${thresholds.humidity.max}%. Possible causes: water leak, poor ventilation, or recent cleaning activity. Risk: Mold growth, equipment corrosion, and electronics damage. Action: Deploy dehumidifiers, check for water leaks or intrusion points, improve ventilation, and inspect HVAC drainage systems.`;
      case 'noise': 
        return `Noise levels exceed ${thresholds.noise.max}dB. Possible causes: equipment malfunction, loose components, or external noise sources. Risk: Potential equipment failure, unsafe working conditions, and communication difficulties. Action: Identify and isolate the noise source, check for loose or vibrating components, and implement additional sound dampening if needed.`;
      case 'temperature': 
        return `Temperature exceeds ${thresholds.temperature.max}°C. Possible causes: HVAC failure, inadequate cooling, or equipment generating excess heat. Risk: Equipment overheating, reduced efficiency, and potential system failures. Action: Increase ventilation, check cooling systems for blockages or failures, reduce heat-generating equipment usage, and inspect insulation for damage.`;
      case 'vibration': 
        return `Vibration exceeds ${thresholds.vibration.max}Hz. Possible causes: equipment imbalance, loose mounting, or mechanical failure. Risk: Accelerated wear and tear, component fatigue, and potential equipment failure. Action: Immediately inspect for loose bolts or mounts, check for obstructions in moving parts, and consider a full mechanical inspection if issues persist.`;
      case 'lightsHumidity': 
        return `Lights area humidity exceeds ${thresholds.lightsHumidity.max}%. Possible causes: water leaks near fixtures, poor ventilation of warm humid air, or nearby water sources. Risk: Electrical hazards, shortened bulb life, and potential fixture corrosion. Action: Improve ventilation around lighting systems, check for nearby water sources, and ensure proper insulation of electrical components.`;
      case 'lightsTemperature': 
        return `Lights area temperature exceeds ${thresholds.lightsTemperature.max}°C. Possible causes: inadequate ventilation, high-power lighting, or external heat sources. Risk: Reduced lighting efficiency, shortened bulb life, and potential fire hazard. Action: Improve airflow around fixtures, consider lower wattage alternatives, install heat shields, and check for proper clearance around light fixtures.`;
      default: 
        return `Value is above recommended threshold of ${thresholds[sensorId]?.max || 'N/A'}. Monitor the situation closely and take action if values continue to rise.`;
    }
  }
  
  return '';
};

// Define a component for the blinking alert
const AlertMessage = ({ status }) => {
  if (status === 'normal') return null;
  
  const alertClass = status === 'high' ? 'alert-high' : 'alert-low';
  const message = status === 'high' ? 'TOO HIGH' : 'TOO LOW';
  
  return (
    <div className={`alert-message ${alertClass}`}>
      {message}
    </div>
  );
};

const SensorDashboard = () => {
  // Use useRef to track if component is mounted
  const isMounted = useRef(true);
  
  // Add a ref to track connection status
  const connectionStatus = useRef('initializing');
  
  // Add state to track loading and error states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // State for sensor data
  const [sensorData, setSensorData] = useState({
    // Sensors group - all values start as empty strings so we don't display "0" before real data arrives
    current: { value: "", history: [], status: 'normal' },
    humidity: { value: "", history: [], status: 'normal' },
    noise: { value: "", history: [], status: 'normal' },
    temperature: { value: "", history: [], status: 'normal' },
    vibration: { value: "", history: [], status: 'normal' },
    
    // Lights group
    lightsHumidity: { value: "", history: [], status: 'normal' },
    lightsTemperature: { value: "", history: [], status: 'normal' },
    timestamp: ""
  });
  
  // Function to determine sensor status based on thresholds
  const getSensorStatus = (sensorId, value) => {
    if (!value || value === '' || isNaN(parseFloat(value))) return 'normal';
    
    const numValue = parseFloat(value);
    const sensorThresholds = thresholds[sensorId];
    
    if (numValue < sensorThresholds.min) return 'low';
    if (numValue > sensorThresholds.max) return 'high';
    return 'normal';
  };
  
  // Set up Firebase real-time listeners
  useEffect(() => {
    console.log("Setting up Firebase listeners");
    
    // Function to get current time in a consistent format
    const currentTime = () => new Date().toLocaleTimeString();
    
    // Helper function to update sensor history and trim to 10 items
    const updateSensorHistory = (newData, sensorKey, value) => {
      // Ensure value is properly parsed as a number
      const numValue = typeof value === 'string' ? parseFloat(value) : value;
      
      // Only update if we have a valid number
      if (!isNaN(numValue)) {
        const status = getSensorStatus(sensorKey, value);
        
        newData[sensorKey] = {
          value: value,
          history: [
            ...(newData[sensorKey].history || []),
            { value: numValue, time: currentTime() }
          ].slice(-10), // Keep only the last 10 items
          status: status
        };
      }
    };
    
    // Function to fetch initial data to ensure we have data from the start
    const fetchInitialData = async () => {
      try {
        // Get initial Sensors data
        const sensorsRef = ref(database, 'Sensors');
        const sensorsSnapshot = await get(sensorsRef);
        const sensorsData = sensorsSnapshot.val();
        
        // Get initial lights data
        const lightsRef = ref(database, 'lights');
        const lightsSnapshot = await get(lightsRef);
        const lightsData = lightsSnapshot.val();
        
        // Update state with initial data
        if (sensorsData || lightsData) {
          setSensorData(prevData => {
            const newData = {...prevData};
            
            // Process sensors data
            if (sensorsData) {
              if (sensorsData.Current !== undefined) updateSensorHistory(newData, 'current', sensorsData.Current);
              if (sensorsData.Humidity !== undefined) updateSensorHistory(newData, 'humidity', sensorsData.Humidity);
              if (sensorsData.Noise !== undefined) updateSensorHistory(newData, 'noise', sensorsData.Noise);
              if (sensorsData.Temperature !== undefined) updateSensorHistory(newData, 'temperature', sensorsData.Temperature);
              if (sensorsData.Vibration !== undefined) updateSensorHistory(newData, 'vibration', sensorsData.Vibration);
            }
            
            // Process lights data
            if (lightsData) {
              if (lightsData.humidity !== undefined) updateSensorHistory(newData, 'lightsHumidity', lightsData.humidity);
              if (lightsData.temperature !== undefined) updateSensorHistory(newData, 'lightsTemperature', lightsData.temperature);
              if (lightsData.timestamp !== undefined) newData.timestamp = lightsData.timestamp;
            }
            
            return newData;
          });
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };
    
    // Fetch initial data
    fetchInitialData()
      .then(() => {
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Failed to fetch initial data:", err);
        setError("Failed to fetch initial data. Please check your connection.");
        setIsLoading(false);
      });
    
    // Listen for changes to the Sensors node
    const sensorsRef = ref(database, 'Sensors');
    const unsubscribeSensors = onValue(sensorsRef, (snapshot) => {
      if (!isMounted.current) return;
      
      const data = snapshot.val();
      if (data) {
        console.log("New Sensors data received:", data);
        
        setSensorData(prevData => {
          const newData = {...prevData};
          
          // Update all sensor values and their history
          if (data.Current !== undefined) updateSensorHistory(newData, 'current', data.Current);
          if (data.Humidity !== undefined) updateSensorHistory(newData, 'humidity', data.Humidity);
          if (data.Noise !== undefined) updateSensorHistory(newData, 'noise', data.Noise);
          if (data.Temperature !== undefined) updateSensorHistory(newData, 'temperature', data.Temperature);
          if (data.Vibration !== undefined) updateSensorHistory(newData, 'vibration', data.Vibration);
          
          return newData;
        });
      }
    }, (error) => {
      console.error("Error in Sensors listener:", error);
      // Try to recover by re-subscribing after a delay
      setTimeout(() => {
        if (isMounted.current) {
          console.log("Attempting to recover Sensors connection...");
          unsubscribeSensors();
          // Re-establish the subscription
          onValue(sensorsRef, /* ... */);
        }
      }, 5000);
    });
    
    // Listen for changes to the lights node
    const lightsRef = ref(database, 'lights');
    const unsubscribeLights = onValue(lightsRef, (snapshot) => {
      if (!isMounted.current) return;
      
      const data = snapshot.val();
      if (data) {
        console.log("New lights data received:", data);
        
        setSensorData(prevData => {
          const newData = {...prevData};
          
          if (data.humidity !== undefined) updateSensorHistory(newData, 'lightsHumidity', data.humidity);
          if (data.temperature !== undefined) updateSensorHistory(newData, 'lightsTemperature', data.temperature);
          if (data.timestamp !== undefined) newData.timestamp = data.timestamp;
          
          return newData;
        });
      }
    }, (error) => {
      console.error("Error in lights listener:", error);
      // Try to recover by re-subscribing after a delay
      setTimeout(() => {
        if (isMounted.current) {
          console.log("Attempting to recover lights connection...");
          unsubscribeLights();
          // Re-establish the subscription
          onValue(lightsRef, /* ... */);
        }
      }, 5000);
    });
    
    // Set up a connection health check
    const healthCheckInterval = setInterval(() => {
      // Ping database to check connection health
      const pingRef = ref(database, '.info/connected');
      onValue(pingRef, (snapshot) => {
        const connected = snapshot.val();
        connectionStatus.current = connected ? "Connected" : "Disconnected";
        console.log("Firebase connection status:", connectionStatus.current);
        
        if (!connected) {
          console.log("Connection lost, attempting to reconnect...");
          // Firebase will automatically try to reconnect
        }
      }, { onlyOnce: true });
    }, 30000); // Check every 30 seconds
    
    // Clean up listeners on unmount
    return () => {
      console.log("Cleaning up Firebase listeners");
      isMounted.current = false;
      unsubscribeSensors();
      unsubscribeLights();
      clearInterval(healthCheckInterval);
    };
  }, []); // Empty dependency array, only run once on mount

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
      
      {error && (
        <div className="error-message">
          <p>Error connecting to Firebase: {error}</p>
          <button onClick={() => window.location.reload()}>
            Reconnect
          </button>
        </div>
      )}
      
      {isLoading && !error && (
        <div className="loading-message">
          <p>Connecting to Firebase and loading sensor data...</p>
        </div>
      )}
      
      <div className="connection-status">
        Connection Status: {connectionStatus.current}
      </div>
      
      <div className="metric-cards">
        {sensorConfig.map(sensor => {
          const sensorStatus = sensorData[sensor.id]?.status || 'normal';
          const cardClass = `metric-card ${sensorStatus !== 'normal' ? `blink-${sensorStatus}` : ''}`;
          
          return (
            <div className={cardClass} key={sensor.id}>
              <div className="metric-header" style={{ backgroundColor: sensor.color }}>
                <div className="metric-icon"></div>
                <span className="metric-label">{sensor.label}</span>
              </div>
              <div className="metric-body">
                <div className="metric-value">
                  {sensorData[sensor.id]?.value !== "" ? sensorData[sensor.id]?.value : "Loading..."}
                </div>
                <div className="metric-unit">{sensor.unit}</div>
                <AlertMessage status={sensorStatus} />
              </div>
            </div>
          );
        })}
        
        <div className="metric-card">
          <div className="metric-header" style={{ backgroundColor: '#718096' }}>
            <div className="metric-icon"></div>
            <span className="metric-label">Timestamp</span>
          </div>
          <div className="metric-body">
            <div className="metric-value">{sensorData.timestamp || "Waiting for update..."}</div>
            <div className="metric-unit"></div>
          </div>
        </div>
      </div>
      
      <div className="charts-container">
        {sensorConfig.map(sensor => {
          const sensorStatus = sensorData[sensor.id]?.status || 'normal';
          const suggestion = getSuggestion(sensor.id, sensorData[sensor.id]?.value, sensorStatus);
          
          return (
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
                      strokeWidth={2}
                      dot={{ fill: sensor.color, r: 4 }}
                      isAnimationActive={true}
                      connectNulls={true}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              {suggestion && <div className={`chart-suggestion ${sensorStatus === 'high' ? 'suggestion-high' : sensorStatus === 'low' ? 'suggestion-low' : ''}`}>
                {suggestion}
              </div>}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SensorDashboard;