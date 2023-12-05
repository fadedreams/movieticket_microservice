## Movie Ticket Microservices Architecture

The Movie Ticket Microservices application introduces an advanced system for transforming the ticketing process. Leveraging a distributed architecture, this platform employs dedicated microservices to handle key aspects of the ticketing workflow.

### Ticket Microservice
Efficiently manages the creation and lifecycle of tickets, offering a seamless experience from creation to potential reservation.

### Order Microservice
Seamlessly orchestrates the ticket ordering process. Communicates with the Ticket Microservice via RabbitMQ, ensuring a decoupled and scalable system.

### Communication via RabbitMQ
Utilizes RabbitMQ as a message broker for smooth communication between microservices. Enhances flexibility and scalability in handling orders and tickets.

### Ticket Availability Management
Implements a sophisticated mechanism to temporarily lock ordered tickets. Clients can reserve tickets during this period, with the Expire Microservice intervening if not reserved within the allocated time.

### Handling Race Conditions
Employs an Optimistic Concurrency Control (OCC) strategy within the Order Microservice. Ensures data integrity and consistency during concurrent operations without relying on external packages. Uses versioning to track changes and intelligently handles concurrent updates.

### Authentication and Session Management
Intricately designed authentication processes depend on RabbitMQ, eliminating direct calls for enhanced security. User sessions are efficiently managed in Redis, contributing to a resilient and performant application.

## Project Structure
```
/mov_ticket
|-- auth
|-- client
|-- common
|-- docker-compose.yml
|-- expiration
|-- orders
|-- tickets
|-- shared.env
|-- test-rabbitmq
```

## Getting Started
1. Clone the repository.
2. Run the Docker Compose configuration using `docker-compose up`.
3. Explore the various microservices and their functionalities.

Contribute, report issues, or provide feedback to collectively enhance and create a seamless and enjoyable movie ticketing experience!
