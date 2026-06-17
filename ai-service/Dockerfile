# Use a lightweight python base image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the application source code
COPY . .

# Expose the service port
EXPOSE 8000

# Run the FastAPI server
CMD ["python", "main.py"]
