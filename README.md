# Next.js OpenAI Availability Checker

## Overview

This project is a Next.js application that integrates with OpenAI's API to provide an availability checker for specific dates. It features a backend API for date validation and availability checking, and a frontend interface to interact with this API and display the results.

## Features

- **Date Validation**: Ensures that the date is in the correct format and is not in the past.
- **Availability Checking**: Fetches availability data from a mock API and checks slot availability for the requested date.
- **Custom Messages**: Provides informative messages based on the availability status and error types.
- **OpenAI Integration**: Utilizes OpenAI's API to interact with the availability checker via a chat interface.

## Project Setup

### Prerequisites

- Node.js (v20 or later)
- npm or yarn

### Installation

1. **Clone the repository:**

2. **Install dependencies:**

    ```bash
    npm install
    # or
    yarn install
    ```

3. **Run the development server:**

    ```bash
    npm run dev
    # or
    yarn dev
    ```

4. **Open your browser and navigate to** `http://localhost:3000` **to view the application.**

## File Structure

- **`app/api/search_availability/route.ts`**: API route for checking availability. Includes utility functions for date validation and availability fetching.
- **`app/examples/search-availability/page.tsx`**: Frontend page that interacts with the API. Features a chat interface and availability widget.

## How It Works

1. **Date Validation**:
   - The `validateDate` function checks the provided date for correct format and ensures it is not a past date.
   - Returns specific error messages if the date is invalid or not in the correct format.

2. **Availability Checking**:
   - Fetches data from a mock API URL.
   - Filters the fetched data based on the requested date.
   - Provides messages about available times and specific 18-hole availability.

3. **Frontend Interaction**:
   - Users input a date through a chat interface.
   - The frontend sends a request to the API with the specified date.
   - Displays the availability information or error messages based on the API response.

## API Endpoint

- **POST `/api/search_availability`**:
  - **Request Body**: 
    ```json
    {
      "date": "YYYY-MM-DD"
    }
    ```
  - **Response**:
    ```json
    {
      "message": "Availability message",
      "eighteenHolesMessage": "18 holes availability message",
      "isValid": true,
      "errorType": "",
      "date": "YYYY-MM-DD"
    }
    ```

## Testing

To ensure the project works correctly, consider using a testing framework such as Jest.

1. **Run tests:**

    ```bash
    npm test
    # or
    yarn test
    ```
