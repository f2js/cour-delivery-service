# cour-delivery-service

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/f2js/cour-delivery-service/tree/main.svg?style=svg&circle-token=1cf5981325219b8d913d95b13380cb4e8a726899)](https://dl.circleci.com/status-badge/redirect/gh/f2js/cour-delivery-service/tree/main)

[![CircleCI](https://dl.circleci.com/insights-snapshot/gh/f2js/cour-delivery-service/main/build-deploy-master/badge.svg?window=30d&circle-token=e1895a57a94edeed182951cf37e776660510c0bc)](https://app.circleci.com/insights/github/f2js/cour-delivery-service/workflows/build-deploy-master/overview?branch=main&reporting-window=last-30-days&insights-snapshot=true)

## Info:
This repository contains the microservice for a courier delivery service. It allows couriers to retrieve, accept, and reject orders. The service is implemented using GraphQL and requires a token with the "COURIER" role to access its endpoints through the Apollo gateway.

### GET /ordersReadyForPickup

Retrives orders that are ready for pickup.

#### Request

- `o_id` (string, required): ID of the order to retrieve.

#### Response

- 200 OK: Orders retrieved successfully.
- 500 Internal Server Error: An error occurred while retrieving orders.


### POST /acceptOrder

Accepts an order

#### Request

- `o_id` (string, required): ID of the order to be accepted.
- `courierId` (string, required): ID of the courier accepting the order.

#### Response

- 200 OK: Order successfully accepted.
- 400 Bad Request: Invalid courier id or courier already has an order.
- 404 Not Found: Order or courier not found.
- 500 Internal Server Error: An error occurred while accepting the order.


### POST /rejectOrder

Rejects an order

#### Request

- `o_id` (string, required): ID of the order to be rejected.
- `courierId` (string, required): ID of the courier rejecting the order.

#### Response

- 200 OK: Order successfully rejected.
- 400 Bad Request: Invalid courier id.
- 404 Not Found: Courier not found.
- 500 Internal Server Error: An error occurred while rejecting the order.


### POST /pickUpOrder

Picking up an order

#### Request

- `o_id` (string, required): ID of the order to be picked up.
- `courierId` (string, required): ID of the courier picking up the order.

#### Response

- 200 OK: Order successfully picked up.
- 400 Bad Request: Invalid courier id or courier does not have an order.
- 404 Not Found: Courier not found.
- 500 Internal Server Error: An error occurred while picking up the order.


### POST /deliverOrder

Delivering an order.

#### Request

- `o_id` (string, required): ID of the order to be delivered.
- `courierId` (string, required): ID of the courier delivering the order.

#### Response

- 200 OK: Order successfully delivered.
- 400 Bad Request: Invalid courier id or courier does not have an order.
- 404 Not Found: Courier not found.
- 500 Internal Server Error: An error occurred while delivering the order.

