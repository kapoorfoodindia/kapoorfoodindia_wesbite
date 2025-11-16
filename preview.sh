#!/bin/bash

# Kapoor Food India - Local Preview Server
# This script starts a local web server to preview the website

echo "🌟 Starting Kapoor Food India Website Preview..."
echo ""
echo "📍 Website will be available at:"
echo "   Homepage: http://localhost:8000"
echo "   Admin:    http://localhost:8000/admin/"
echo ""
echo "🔐 Admin Login:"
echo "   Username: admin"
echo "   Password: admin123"
echo ""
echo "Press Ctrl+C to stop the server"
echo "================================"
echo ""

# Start Python HTTP server
python3 -m http.server 8000
