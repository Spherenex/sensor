// import React, { useState, useEffect } from 'react';
// import { initializeApp } from "firebase/app";
// import { getDatabase, ref, onValue } from "firebase/database";
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
// import './App.css';

// // Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyBGvhE5d797L-I63rQz9nN8HbkLg0keahU",
//   authDomain: "spherenex-1c0a4.firebaseapp.com",
//   databaseURL: "https://spherenex-1c0a4-default-rtdb.firebaseio.com",
//   projectId: "spherenex-1c0a4",
//   storageBucket: "spherenex-1c0a4.firebasestorage.app",
//   messagingSenderId: "371635296796",
//   appId: "1:371635296796:web:6a9845e68f8d296e5bddd9",
//   measurementId: "G-P36RZB6674"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// const database = getDatabase(app);

// const SensorDashboard = () => {
//   // State for sensor data
//   const [sensorData, setSensorData] = useState({
//     // Sensors group
//     current: { value: "0", history: [] },
//     humidity: { value: "0", history: [] },
//     noise: { value: "0", history: [] },
//     temperature: { value: "0", history: [] },
//     vibration: { value: "0", history: [] },
    
//     // Lights group
//     lightsHumidity: { value: 0, history: [] },
//     lightsTemperature: { value: 0, history: [] },
//     timestamp: "0"
//   });
  
//   // Set up Firebase real-time listeners
//   useEffect(() => {
//     const currentTime = () => new Date().toLocaleTimeString();
    
//     // Listen for changes to the Sensors node
//     const sensorsRef = ref(database, 'Sensors');
//     const sensorsListener = onValue(sensorsRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         setSensorData(prevData => {
//           const newData = {...prevData};
          
//           // Update all sensor values and their history
//           if (data.Current !== undefined) {
//             const value = data.Current;
//             newData.current = {
//               value: value,
//               history: [...(prevData.current.history || []), {
//                 value: parseFloat(value),
//                 time: currentTime()
//               }]
//             };
//           }
          
//           if (data.Humidity !== undefined) {
//             const value = data.Humidity;
//             newData.humidity = {
//               value: value,
//               history: [...(prevData.humidity.history || []), {
//                 value: parseFloat(value),
//                 time: currentTime()
//               }]
//             };
//           }
          
//           if (data.Noise !== undefined) {
//             const value = data.Noise;
//             newData.noise = {
//               value: value,
//               history: [...(prevData.noise.history || []), {
//                 value: parseFloat(value),
//                 time: currentTime()
//               }]
//             };
//           }
          
//           if (data.Temperature !== undefined) {
//             const value = data.Temperature;
//             newData.temperature = {
//               value: value,
//               history: [...(prevData.temperature.history || []), {
//                 value: parseFloat(value),
//                 time: currentTime()
//               }]
//             };
//           }
          
//           if (data.Vibration !== undefined) {
//             const value = data.Vibration;
//             newData.vibration = {
//               value: value,
//               history: [...(prevData.vibration.history || []), {
//                 value: parseFloat(value),
//                 time: currentTime()
//               }]
//             };
//           }
          
//           return newData;
//         });
//       }
//     });
    
//     // Listen for changes to the lights node
//     const lightsRef = ref(database, 'lights');
//     const lightsListener = onValue(lightsRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data) {
//         setSensorData(prevData => {
//           const newData = {...prevData};
          
//           if (data.humidity !== undefined) {
//             const value = data.humidity;
//             newData.lightsHumidity = {
//               value: value,
//               history: [...(prevData.lightsHumidity.history || []), {
//                 value: value,
//                 time: currentTime()
//               }]
//             };
//           }
          
//           if (data.temperature !== undefined) {
//             const value = data.temperature;
//             newData.lightsTemperature = {
//               value: value,
//               history: [...(prevData.lightsTemperature.history || []), {
//                 value: value,
//                 time: currentTime()
//               }]
//             };
//           }
          
//           if (data.timestamp !== undefined) {
//             newData.timestamp = data.timestamp;
//           }
          
//           return newData;
//         });
//       }
//     });
    
//     // Clean up listeners on unmount
//     return () => {
//       sensorsListener();
//       lightsListener();
//     };
//   }, []);

//   // Keep only last 10 history items for each sensor
//   useEffect(() => {
//     setSensorData(prevData => {
//       const newData = {...prevData};
      
//       // Trim history arrays to last 10 items
//       Object.keys(newData).forEach(key => {
//         if (newData[key] && newData[key].history && newData[key].history.length > 10) {
//           newData[key].history = newData[key].history.slice(-10);
//         }
//       });
      
//       return newData;
//     });
//   }, [sensorData]);

//   // Configuration for sensor cards
//   const sensorConfig = [
//     {
//       id: 'current',
//       label: 'Current',
//       unit: 'A',
//       color: '#4287f5',
//       group: 'Sensors'
//     },
//     {
//       id: 'humidity',
//       label: 'Humidity',
//       unit: '%',
//       color: '#1fb978',
//       group: 'Sensors'
//     },
//     {
//       id: 'noise',
//       label: 'Noise',
//       unit: 'dB',
//       color: '#f54242',
//       group: 'Sensors'
//     },
//     {
//       id: 'temperature',
//       label: 'Temperature',
//       unit: '°C',
//       color: '#a367dc',
//       group: 'Sensors'
//     },
//     {
//       id: 'vibration',
//       label: 'Vibration',
//       unit: 'Hz',
//       color: '#f59c42',
//       group: 'Sensors'
//     },
//     {
//       id: 'lightsHumidity',
//       label: 'Lights Humidity',
//       unit: '%',
//       color: '#42b6f5',
//       group: 'Lights'
//     },
//     {
//       id: 'lightsTemperature',
//       label: 'Lights Temperature',
//       unit: '°C',
//       color: '#f542c8',
//       group: 'Lights'
//     }
//   ];

//   return (
//     <div className="dashboard">
//       <h1 className="dashboard-title">Sensor Dashboard</h1>
      
//       <div className="metric-cards">
//         {sensorConfig.map(sensor => (
//           <div className="metric-card" key={sensor.id}>
//             <div className="metric-header" style={{ backgroundColor: sensor.color }}>
//               <div className="metric-icon"></div>
//               <span className="metric-label">{sensor.label}</span>
//             </div>
//             <div className="metric-body">
//               <div className="metric-value">
//                 {sensorData[sensor.id]?.value || 0}
//               </div>
//               <div className="metric-unit">{sensor.unit}</div>
//             </div>
//           </div>
//         ))}
        
//         <div className="metric-card">
//           <div className="metric-header" style={{ backgroundColor: '#718096' }}>
//             <div className="metric-icon"></div>
//             <span className="metric-label">Timestamp</span>
//           </div>
//           <div className="metric-body">
//             <div className="metric-value">{sensorData.timestamp}</div>
//             <div className="metric-unit"></div>
//           </div>
//         </div>
//       </div>
      
//       <div className="charts-container">
//         {sensorConfig.map(sensor => (
//           <div className="chart-card" key={`chart-${sensor.id}`}>
//             <h2 className="chart-title">{sensor.label} History</h2>
//             <div className="chart-container">
//               <ResponsiveContainer width="100%" height="100%">
//                 <LineChart data={sensorData[sensor.id]?.history || []}>
//                   <CartesianGrid strokeDasharray="3 3" />
//                   <XAxis dataKey="time" tick={{ fontSize: 12 }} />
//                   <YAxis domain={['auto', 'auto']} />
//                   <Tooltip />
//                   <Line 
//                     type="monotone" 
//                     dataKey="value" 
//                     stroke={sensor.color} 
//                     dot={{ fill: sensor.color, r: 4 }}
//                     isAnimationActive={true}
//                   />
//                 </LineChart>
//               </ResponsiveContainer>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default SensorDashboard;






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
    current: { value: "", history: [] },
    humidity: { value: "", history: [] },
    noise: { value: "", history: [] },
    temperature: { value: "", history: [] },
    vibration: { value: "", history: [] },
    
    // Lights group
    lightsHumidity: { value: "", history: [] },
    lightsTemperature: { value: "", history: [] },
    timestamp: ""
  });
  
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
        newData[sensorKey] = {
          value: value,
          history: [
            ...(newData[sensorKey].history || []),
            { value: numValue, time: currentTime() }
          ].slice(-10) // Keep only the last 10 items
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
        {sensorConfig.map(sensor => (
          <div className="metric-card" key={sensor.id}>
            <div className="metric-header" style={{ backgroundColor: sensor.color }}>
              <div className="metric-icon"></div>
              <span className="metric-label">{sensor.label}</span>
            </div>
            <div className="metric-body">
              <div className="metric-value">
                {sensorData[sensor.id]?.value !== "" ? sensorData[sensor.id]?.value : "Loading..."}
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
            <div className="metric-value">{sensorData.timestamp || "Waiting for update..."}</div>
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
                    strokeWidth={2}
                    dot={{ fill: sensor.color, r: 4 }}
                    isAnimationActive={true}
                    connectNulls={true}
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