# Filename: model_serving.py

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from prometheus_client import start_http_server, Counter, Histogram
import pandas as pd
import time
import uvicorn
# Import your forecasting model (e.g., Prophet) here
from prophet import Prophet

# Initialize Prometheus metrics
REQUEST_COUNT = Counter('request_count', 'Total number of requests')
REQUEST_LATENCY = Histogram('request_latency_seconds', 'Request latency')

app = FastAPI()

# Define the PredictionRequest model
class PredictionRequest(BaseModel):
    future_dates: int  # Number of future days for predictions

# Initialize your forecasting model
model = Prophet()
# Train your model with some historical data here if needed
# For example, this could be historical time-series data:
data = pd.DataFrame({
    'ds': pd.date_range(start="2023-01-01", periods=365, freq='D'),  # Example date range
    'y': [i * 0.5 + 2 for i in range(365)]  # Example data
})
model.fit(data)

@app.post("/predict")
async def predict(request: PredictionRequest):
    REQUEST_COUNT.inc()  # Increment request count
    start_time = time.time()

    try:
        # Generate future dates based on input
        future = model.make_future_dataframe(periods=request.future_dates)
        forecast = model.predict(future)
        predictions = forecast[['ds', 'yhat']].tail(request.future_dates)

        # Record latency
        REQUEST_LATENCY.observe(time.time() - start_time)
        return predictions.to_dict(orient='records')
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

if __name__ == "__main__":
    # Start Prometheus metrics server on port 8001
    start_http_server(8001)
    # Run the FastAPI app with Uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
