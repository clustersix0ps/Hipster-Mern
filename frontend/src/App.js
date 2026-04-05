import React, { useEffect, useState } from 'react';

function App() {
  const [status, setStatus] = useState('Loading...');

  useEffect(() => {
    fetch('/api/gateway/health')
      .then(res => res.json())
      .then(data => setStatus('Gateway Connected! Status: ' + data.status))
      .catch(err => setStatus('Error connecting to gateway'));
  }, []);

  return (
    <div className="container">
      <h1>MERN Microservices Dashboard</h1>
      <p>Welcome to your 3-tier MERN application powered by 12 microservices!</p>
      
      <div className="service">
        <strong>Gateway Status:</strong> {status}
      </div>

      <p>Try making requests to the gateway at <code>/api/user</code> or <code>/api/product</code>!</p>
    </div>
  );
}

export default App;
