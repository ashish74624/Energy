import React, { useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';

function PriceForecast() {
    const [forecastData, setForecastData] = useState([]);
    const [days, setDays] = useState(7);

    const getForecast = async () => {
        try {
            const { data } = await axios.post('http://localhost:5000/get-price-forecast', { future_dates: days });
            setForecastData(data.forecast);
        } catch (error) {
            console.error('Error fetching forecast:', error);
        }
    };

    return (
        <div>
            <h1>Energy Price Forecast</h1>
            <input type="number" value={days} onChange={(e) => setDays(e.target.value)} />
            <button onClick={getForecast}>Get Forecast</button>
            <Line
                key={`forecast-line-chart-${Date.now()}`}
                data={{
                    labels: forecastData.map(point => point.ds),
                    datasets: [
                        {
                            label: 'Forecasted Price',
                            data: forecastData.map(point => point.yhat),
                            fill: false,
                            borderColor: 'blue',
                        },
                    ],
                }}
            />
        </div>
    );
}

export default PriceForecast;
