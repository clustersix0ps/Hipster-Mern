# 🎓 MERN Microservices: Learning & Interview Guide

This document is designed to take you from a beginner to an expert in Microservices architecture, Kubernetes, and modern DevOps practices using this project as a conceptual playground.

---

## 1. What are Microservices?

### The Monolith (The Old Way)
In a traditional MERN app, your Express API does everything: handles users, products, orders, and payments. It all runs in one massive Node.js process and uses a single MongoDB database.
- **Problem**: If the Order processing crashes, the login breaks. If Cart traffic spikes on Black Friday, you have to scale the *entire* application just to handle the Cart load.

### Microservices (The New Way)
We split the business domains up. In this project, we have 12 distinct apps.
- **Benefit (Isolation)**: If `cart-service` crashes, `auth-service` still works.
- **Benefit (independent Scaling)**: Scale `cart-service` to 10 pods, keep `analytics-service` at 1 pod.
- **Benefit (Tech Diversity)**: Though they are all Node.js to keep things simple here, in reality, `analytics-service` could be written in Python, `payment` in Go, and `auth` in Node.js.

---

## 2. Why Kubernetes (K8s)?

When you have 12 microservices, you are suddenly managing 12 repositories, 12 ports, and 12 environments. Docker handles the packaging, but creating networks between them manually via `docker-compose` is brittle.

Kubernetes is an **orchestrator**. It essentially says:
> *"Tell me what state you want (e.g., 5 Replicas of the user-service), and I will constantly monitor the system to ensure that state exists."*

### Key K8s Components Used Here:
- **Deployments**: We use Deployments for our Node.js and React apps because they are **Stateless**. If a `user-service` Pod dies, K8s spins up an identical new one instantly. They hold no memory of the past.
- **StatefulSets**: Used for MongoDB and Redis. Unlike Deployments, databases *need* state. They need the same DNS identity (`mongo-auth-0`) after they restart to re-attach to their Persistent Volume (where data is actually saved).
- **ClusterIP Services**: Internal phonebooks. When the `gateway-service` wants to talk to `auth-service`, it doesn't need to know the dynamic IP of the pod, it just pings `http://auth-service`. 
- **Namespaces**: Logical boundaries. `mern-frontend`, `mern-backend`, `mern-db`. It allows us to segment rules.

---

## 3. The Role of the API Gateway & Envoy

A frontend React application cannot (and should not) individually call `http://cart-service.internal` or `http://auth-service.internal`. 

1. **Envoy Proxy**: This is our Edge Load Balancer. It receives traffic from the open internet on Port 80.
   - If a user types `mywebsite.com/`, Envoy sends them to the **Frontend React App**.
   - If a user makes an API call to `mywebsite.com/api/user`, Envoy routes them to the **Gateway Service**.
2. **Gateway Service (Node.js)**: Our simple HTTP routing app. It receives the `/api/user` call from Envoy, strips the base path, and proxies the request to the `user-service` ClusterIP. 

---

## 4. Advanced DevOps Elements Included

### RBAC (Role-Based Access Control)
In `rbac.yaml`, we've defined a `Role` and `RoleBinding`. This prevents random services from interacting with the K8s API directly. Security best practice.

### Network Policies
Think of Network Policies as firewalls inside K8s. In `network-policies.yaml`, we implemented a **Default Deny All** policy for the backend namespace. This means even if a hacker compromises `auth-service`, they cannot blindly ping `payment-service`. The only traffic explicitly allowed is:
1. `Envoy` (in frontend NS) contacting `gateway-service` (in backend NS).
2. `gateway-service` contacting other backends.

### Helm templating
You noticed we have 12 Microservices. If we wrote raw K8s YAML for all 12, we'd have 12 `Deployment.yaml` copies. If we wanted to add a health check probe to all services, we'd have to edit 12 files.
- **The Solution**: The `microservice-chart`. It is a template. We wrote the `Deployment.yaml` *once* using placeholders (like `{{ .Values.image.repository }}`).
- Then, we parse the 12 distinct `values.yaml` files through the same chart template. **DRY** code applied to infrastructure!

### Caching (Redis)
Why does `product-service` and `cart-service` use Redis?
A relational/document DB (MongoDB) has to hit the disk to retrieve data—this takes maybe ~10-20ms. Redis is an **In-Memory Store**, meaning it holds data in RAM. Retrieval is <1ms. For product catalogs (read heavy) and shopping carts (frequently mutated but short lived), Redis drastically speeds up response times and reduces DB load.

### JWT Authentication
`auth-service` securely generates JSON Web Tokens.
- Once a user logs in, they receive a JWT.
- In production, the `gateway-service` would intercept all requests, validate the JWT mathematically (without bothering the auth-service again because it's stateless!), and forward the User's ID down to the `cart-service`.

---

## 5. Potential Interview Questions Based on this Architecture

**Q1: What's the difference between a Deployment and a StatefulSet?**
*A1:* Deployments are for stateless applications. Pods are interchangeable and ephemeral. StatefulSets are for stateful applications like Databases. They provide guarantees about ordering and uniqueness (persistent networking identities and sticky storage attached via PVs).

**Q2: How do your microservices communicate?**
*A2:* In this application, they communicate synchronously via HTTP/REST. (An alternative you can mention for advanced points is Asynchronous communication via an Event Bus like RabbitMQ or Kafka, which is great for the `order -> payment -> notification` flow).

**Q3: How would you scale this if traffic spiked?**
*A3:* Thanks to K8s, I would create an HPA (Horizontal Pod Autoscaler) targetting CPU utilization at 70%. If CPU rises, K8s will automatically replicate the specific bottlenecked service up to X times via the replication controller.

**Q4: Why divide the database layer?**
*A4:* In microservices, the golden rule is "Database per Service". If `user-service` and `product-service` share a Mongo instance, a massive product query could lock the DB CPU and take down the user service. By splitting them, we prevent cascading failures and guarantee true domain separation. (We used a hybrid approach here for resource management constraint reasons!)
