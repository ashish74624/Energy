// RealTimeData.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function RealTimeData() {
    const [priceData, setPriceData] = useState({});

    useEffect(() => {
        const interval = setInterval(async () => {
            const { data } = await axios.get('http://localhost:5000/api/real-time-data');
            setPriceData(data);
        }, 5000); // Fetch every 5 seconds

        return () => clearInterval(interval);
    }, []);

    return (
        <div>
            <h1>Real-Time Energy Price</h1>
            <p>Timestamp: {new Date(priceData.timestamp * 1000).toLocaleTimeString()}</p>
            <p>Price: {priceData.price}</p>
        </div>
    );
}

export default RealTimeData;
