FROM node:20-alpine

# Install Verdaccio
RUN npm install -g verdaccio@latest

# Create app directory and a non-root user
RUN mkdir -p /app /verdaccio-storage && \
    adduser -D -h /app verdaccio && \
    chown -R verdaccio:verdaccio /app /verdaccio-storage

# Set working directory
WORKDIR /app

# Copy config file
COPY config.yaml /app/config.yaml

# Expose default Verdaccio port
EXPOSE 4873

# Set environment variables
ENV VERDACCIO_PORT=4873

# Switch to non-root user
USER verdaccio

# Start Verdaccio
CMD verdaccio --config /app/config.yaml & \
    (while true; do \
        echo "Storage location: /verdaccio-storage"; \
        echo "Registry size: $(du -sh /verdaccio-storage | cut -f1)"; \
        sleep 60; \
    done)