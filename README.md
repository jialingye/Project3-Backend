# Project-3

### Backend Deployment Link
[CasaAmor Backend](https://airbnb-main.onrender.com)


## Project Description
<p>CasaAmor is a specialized rental platform designed exclusively for honeymoon couples. Inspired by Airbnb, CasaAmor aims to provide a unique and unforgettable experience for couples celebrating their honeymoon. With a focus on romantic destinations and accommodations, CasaAmor offers a curated selection of properties tailored to create a perfect setting for newlyweds.

The project involves the development of a web application with four main databases: User, Booking, Reviews, and Listings. Users can create an account, browse through a collection of romantic properties, make bookings, and leave reviews after their stay, rent your own properties and see income you make from properties. The platform provides a seamless and secure booking process, ensuring a hassle-free experience for couples planning their dream honeymoon.</p>

## Features
<ul>
    <li>User Registration and Authentication: Users can create accounts, log in, and manage their profiles. Authentication ensures secure access to personal information.</li>
    <li>Listings and Search: CasaAmor showcases a wide range of romantic accommodations, including luxurious villas, cozy cottages, and private beachfront resorts. Users can search, filter, and view detailed listings with photos, amenities, pricing, and availability.</li>
    <li>Booking Management: Users can select their desired property, specify their travel dates, and make bookings. The platform handles the booking process, including availability checking, reservation confirmation.</li>
    <li>Reviews and Ratings: After their stay, users can leave reviews and ratings for the properties they rented. This feedback system helps future couples make informed decisions and ensures the quality of listings.</li>
    <li>User Dashboard: Users have access to a personalized dashboard where they can manage their bookings, view past and upcoming trips, update their profile information, and access customer support.</li>
    <li>Admin Panel: An administration panel allows the platform administrators to manage listings, user accounts, bookings, and reviews. It provides tools for content moderation, monitoring, and resolving any issues that may arise.</li>
    
</ul>

## Backend Overview

This backend project is designed to showcase my backend development skills and provide an overview of my model structure. It utilizes the following technologies and frameworks:

- **Node.js**: A JavaScript runtime environment that allows running JavaScript code on the server-side.
- **Express.js**: A fast and minimalist web application framework for Node.js that simplifies the development of APIs and web applications.
- **MongoDB**: A NoSQL database used for storing and retrieving data. The project uses MongoDB as the primary data storage solution.
- **Mongoose**: An Object Data Modeling (ODM) library for MongoDB and Node.js that provides a straightforward way to define models, schema, and interact with the database.
- **Postman**: A powerful API testing and documentation platform that was used to test the backend API endpoints during development.

## Model Structure

The backend project consists of the following models:

- **User**: Represents a user of the application. It stores user information such as name, email, password (hashed), listings data, bookings data, reviews data, profile picture, occupation, and description.
- **Booking**: Represents a booking made by a user. It includes information about the property, guest data, host data, property picture, property address, check-in/check-out dates, total price, and created date.
- **Review**: Represents a review left by a user for a particular property. It contains information about the reviewer, property, cleanliness rating, location rating, service rating, overall rating, review content, and created date.
- **Listing**: Represents a property listing on the platform. It includes information such as title, description, price, address, images, room/bed/bathroom/guest numbers, amenities, property type, privacy, and retrieves city, country, latitude, and longitude from the Google Map Geocoding API.

These models are defined using Mongoose schemas and are used to create, retrieve, update, and delete data in the MongoDB database.

## User Route

The user route handles authentication and user-related operations. It includes the following endpoints:

- **POST /login**: This endpoint is used to authenticate a user by comparing their email and password with the data stored in the database. If the authentication is successful, a JSON Web Token (JWT) is generated and returned to the client along with the current user's information.

- **GET /signup**: This endpoint is used to retrieve the sign-up page for creating a new user account.

- **POST /signup**: This endpoint is used to create a new user account. It takes the user's username, email, and password as input, hashes the password using bcrypt, and stores the user's information in the database.

- **GET /logout**: This endpoint is used to log out the currently authenticated user by destroying their session and clearing the token cookie.

- **GET /:id**: This endpoint is used to retrieve the user profile page for a specific user. It takes the user's ID as a parameter and returns the user's information, including their listings, bookings, and reviews.

- **PUT /:id**: This endpoint is used to update the user's information. It takes the user's ID as a parameter and the updated user data as the request body. It updates the user's information in the database and returns the updated user object.

These endpoints handle user authentication, account creation, retrieval of user information, and updating user data. The route uses the `express` framework along with `bcryptjs` for password hashing, `jsonwebtoken` for generating JSON Web Tokens, and `express-session` for session management.

## Listing Routes

The listing routes handle operations related to property listings. It includes the following endpoints:

- **GET /listings**: Retrieves all property listings based on the provided query parameters. The query parameters can be used to filter the listings by price, amenities, and other attributes.

- **GET /listings/search**: Searches for available listings based on the provided query parameters, including location, start date, end date, and guest number.

- **GET /listings/:id**: Retrieves a specific listing based on the provided ID.

- **POST /listings**: Creates a new listing with the provided listing details.

- **PUT /listings/:id**: Updates an existing listing based on the provided ID with the updated listing details.

- **DELETE /listings/:id**: Deletes a specific listing based on the provided ID.

These endpoints allow users to browse, search, create, update, and delete property listings. The route utilizes the `express` framework and integrates with MongoDB for data storage and retrieval. It also includes integration with external services, such as Google Maps API, for geocoding and retrieving location information.

## Booking Routes

The booking routes handle operations related to property bookings. It includes the following endpoints:

- **GET /bookings**: Retrieves all bookings.

- **GET /bookings/host/:id**: Retrieves bookings associated with a specific host ID.

- **GET /bookings/income/:id**: Retrieves the income by month for a specific host ID.

- **GET /bookings/:id**: Retrieves a specific booking based on the provided ID.

- **POST /bookings**: Creates a new booking with the provided booking details. It checks for booking overlap and calculates the total price based on the duration of stay.

- **PUT /bookings/:id**: Updates an existing booking based on the provided ID with the updated booking details. It also checks for booking overlap and recalculates the total price.

- **DELETE /bookings/:id**: Deletes a specific booking based on the provided ID.

These endpoints allow users to retrieve, create, update, and delete property bookings. The route utilizes the `express` framework and integrates with MongoDB for data storage and retrieval. It performs checks for booking overlap and calculates the total price based on the duration of stay. The route also includes additional endpoints for retrieving bookings associated with a specific host ID and calculating income by month for a specific host ID.

## Review Routes

The review routes handle operations related to property reviews. It includes the following endpoints:

- **GET /reviews**: Retrieves all reviews.

- **GET /reviews/:id**: Retrieves a specific review based on the provided ID.

- **POST /reviews**: Creates a new review with the provided review details. It also associates the reviewer's username and image with the review.

- **GET /reviews/filter?overallRating=value**: Retrieves reviews based on the specified overall rating value.

- **PUT /reviews/:id**: Updates an existing review based on the provided ID with the updated review details. It also recalculates the rating for the associated listing.

- **DELETE /reviews/:id**: Deletes a specific review based on the provided ID.

These endpoints allow users to retrieve, create, update, and delete property reviews. The route utilizes the `express` framework and integrates with MongoDB for data storage and retrieval. It includes an additional endpoint for filtering reviews based on the overall rating value. The route also updates the rating for the associated listing when a review is created or updated.









