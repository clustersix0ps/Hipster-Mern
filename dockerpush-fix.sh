#!/bin/bash
# Rebuild and push only the services that were failing
set -e

echo "==> Building authservice (fixed: removed deprecated Mongoose options)"
docker build --no-cache -t savitxr/authservice-hipster:latest ./src/authservice
docker push savitxr/authservice-hipster:latest

echo "==> Building cartservice (fixed: removed deprecated Mongoose options)"
docker build --no-cache -t savitxr/cartservice-hipster:latest ./src/cartservice
docker push savitxr/cartservice-hipster:latest

echo "==> Building productcatalogservice (fixed: removed deprecated Mongoose options)"
docker build --no-cache -t savitxr/productcatalogservice-hipster:latest ./src/productcatalogservice
docker push savitxr/productcatalogservice-hipster:latest

echo "==> Building currencyservice (fixed: added cors + morgan to package.json)"
docker build --no-cache -t savitxr/currencyservice-hipster:latest ./src/currencyservice
docker push savitxr/currencyservice-hipster:latest

echo "==> Building paymentservice (fixed: added cors + morgan to package.json)"
docker build --no-cache -t savitxr/paymentservice-hipster:latest ./src/paymentservice
docker push savitxr/paymentservice-hipster:latest

echo ""
echo "All fixed images pushed. Now rollout restart the affected deployments:"
echo "  kubectl rollout restart deployment/authservice deployment/cartservice deployment/productcatalogservice deployment/currencyservice deployment/paymentservice -n hipster"
