# Use official Python image
FROM python:3.12-slim

# Set working directory
WORKDIR /app

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copy dependency files
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of your backend code
COPY . .

# Make entrypoint script executable
RUN chmod +x docker-entrypoint.sh

# Expose the port
EXPOSE 8004

# Use entrypoint script
ENTRYPOINT ["./docker-entrypoint.sh"]
