# Nimo Crypto Price Email Service

A serverless TypeScript-based AWS Lambda application that fetches cryptocurrency prices, emails them to users via SES, and stores search history in DynamoDB.

---

## Features

- Fetch real-time crypto prices from CoinGecko
- Send results via AWS SES
- Store search history in DynamoDB
- Pagination with `limit` and `lastKey`
- Input validation using `class-validator`
- Unit & integration tests with Jest
- Local development with Docker (DynamoDB Local)


## Tech Stack

- **Language**: TypeScript
- **Runtime**: AWS Lambda (Node.js 20)
- **Deployment**: AWS SAM
- **Database**: DynamoDB
- **Email**: Amazon SES
- **HTTP Client**: Axios
- **Testing**: Jest + aws-sdk-client-mock


## Setup

### 1. Clone and Install Dependencies
npm install

### 2. Environment Variables
EMAIL_FROM=your-verified-email@example.com
DYNAMO_TABLE=CryptoSearchTable

### 3. Docker (for DynamoDB Local)
docker compose up -d

### 4. Run Tests
npm run test


# Testing with Jest
 - Mocks AWS SDK clients using aws-sdk-client-mock
 - Includes unit tests for SES, DynamoDB
 - Integration tests for crypto service

# API Endpoints

## POST /crypto
Body:
{
  "cryptoName": "bitcoin",
  "email": "user@example.com"
}

Response
{
  "message": "Price of the crypto currency sent successfully to user@example.com",
  "cryptoName": "Bitcoin",
  "price": 50000
}

## GET /crypto/history
QueryParams:
 - Limit (optional)
 - lastKey (optional encoded key)

 Response:
 {
    "items": [{...}],
    "nextPageToken": "encodedKey"
 }

# Deployment
- npm run build 
- npm run deploy

# AWS SES Setup
- Start in sandbox (default)
- Verify your sender and recipient email addresses