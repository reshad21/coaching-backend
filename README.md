# GG Medical - Express Backend

This is the backend for the GG Medical project, built using **Express**, **TypeScript**, and **Prisma**. The project implements GraphQL for the API layer and connects to a database using Prisma. It includes basic features such as environment configuration, database migrations, and seeding.

## Table of Contents

- [Installation](#installation)
- [Setup](#setup)
- [Scripts](#scripts)
- [Prisma](#prisma)
- [License](#license)

## Installation

Follow the steps below to set up the project on your local machine:

1. **Clone the repository**:

    ```bash
    git clone https://github.com/mntechdigital/GMC_Portal_-Backend.git
    ```

2. **Navigate into the project directory**:

    ```bash
    cd GMC_Portal_-Backend
    ```

3. **Install the required dependencies**:

    ```bash
    npm install
    ```

## Setup

1. **Create environment variables**:

    Create a `.env` file in the root directory of your project. Add the required environment variables such as database connection strings, endpoint URL, and any other configuration specific to your environment.

2. **Set up Prisma**:

    Generate the Prisma client:

    ```bash
    npx prisma generate
    ```

    Set up the database by running migrations:

    ```bash
    npx prisma migrate dev
    ```

    Seed the database with initial data:

    ```bash
    npx prisma db seed
    ```

3. **Run the development server**:

    After setting up the environment variables and Prisma, you can run the development server:

    ```bash
    npm run dev
    ```

## Scripts

The following npm scripts are available in this project:

- `npm run dev`: Runs the development server using tsx to watch and compile the TypeScript code.
- `npm run build`: Compiles the TypeScript code into JavaScript and builds the project.
- `npm run start`: Starts the production server after the project is built.

## Prisma

This project uses Prisma to interact with the database. Here are some important commands related to Prisma:

- **Generate Prisma client**: After modifying your Prisma schema, regenerate the Prisma client:

  ```bash
  npx prisma generate
  ```

- **Run database migrations**: When you change the Prisma schema, run the following command to apply migrations to your database:

  ```bash
  npx prisma migrate dev
  ```

- **Seed the database**: You can seed the database with initial data by running:

  ```bash
  npx prisma db seed
  ```
