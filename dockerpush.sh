#!/bin/bash
docker build --no-cache -t savitxr/adservice-hipster:latest ./src/adservice
docker push savitxr/adservice-hipster:latest
docker build --no-cache -t savitxr/authservice-hipster:latest ./src/authservice
docker push savitxr/authservice-hipster:latest
docker build --no-cache -t savitxr/cartservice-hipster:latest ./src/cartservice
docker push savitxr/cartservice-hipster:latest
docker build --no-cache -t savitxr/checkoutservice-hipster:latest ./src/checkoutservice
docker push savitxr/checkoutservice-hipster:latest
docker build --no-cache -t savitxr/currencyservice-hipster:latest ./src/currencyservice
docker push savitxr/currencyservice-hipster:latest
docker build --no-cache -t savitxr/emailservice-hipster:latest ./src/emailservice
docker push savitxr/emailservice-hipster:latest
docker build --no-cache -t savitxr/frontend-hipster:latest ./src/frontend
docker push savitxr/frontend-hipster:latest
docker build --no-cache -t savitxr/assistantservice-hipster:latest ./src/assistantservice
docker push savitxr/assistantservice-hipster:latest
docker build --no-cache -t savitxr/paymentservice-hipster:latest ./src/paymentservice
docker push savitxr/paymentservice-hipster:latest
docker build --no-cache -t savitxr/productcatalogservice-hipster:latest ./src/productcatalogservice
docker push savitxr/productcatalogservice-hipster:latest
docker build --no-cache -t savitxr/recommendationservice-hipster:latest ./src/recommendationservice
docker push savitxr/recommendationservice-hipster:latest
docker build --no-cache -t savitxr/shippingservice-hipster:latest ./src/shippingservice
docker push savitxr/shippingservice-hipster:latest
