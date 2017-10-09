"use strict";

const express = require('express');
const RouterWrapper = require('./RouterWrapper');
const DatabaseLayer = require('./DBLayer');
const Server = require('./Server');

let server = new Server(express, new RouterWrapper(express.Router()), new DatabaseLayer());



