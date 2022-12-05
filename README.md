# cour-delivery-service


[Componenet/Integration test]( https://github.com/f2js/cour-delivery-service/blob/main/Test/deliveryController.test.js)

## Acceptance test
### Feature: OrdersReadyForPickup

#### Scenario: Couirer checks list of orders ready for pickup

**Given** we have a courier ready to pick up an order

**When** the courier sends a request to the server

**Then** return a response with orders ready for pickup

### Feature: AcceptOrder

#### Scenario: Couirer accepts an order from the pickup list

**Given** we have a courier accepting an order from the pickup list

**When** the courier sends a request to the server

**Then** update the couriers acecpted order list and return a response with message "Order accepted"

### Feature: RejectOrder

#### Scenario: Couirer rejects an order from the orders accepted list

**Given** we have a courier with an existing order in the orders accepted list

**When** the courier sends a request to the server

**Then** update the couriers acecpted order list and return a response with message "Order rejceted"

### Feature: OrderPickedUp

#### Scenario: Couirer picks up an order

**Given** we have a courier that picks up an order

**When** the courier sends a request to the server

**Then** return a response with message "Order picked up"

### Feature: OrderDelivered

#### Scenario: Couirer delivered an order

**Given** we have a courier that deliveres an order

**When** the courier sends a request to the server

**Then** return a response with message "Order delivered"







