const router = require('express').Router();
const Users = require('models/db/users.js');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const endpointSecret = process.env.STRIPE_ENDPOINT_SECRET;
const failureEndpointSecret = process.env.STRIPE_FAILURE_ENDPOINT_SECRET;

