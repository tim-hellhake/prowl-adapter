# Prowl Adapter

[![Build Status](https://travis-ci.org/tim-hellhake/prowl-adapter.svg?branch=master)](https://travis-ci.org/tim-hellhake/prowl-adapter)
[![dependencies](https://david-dm.org/tim-hellhake/prowl-adapter.svg)](https://david-dm.org/tim-hellhake/prowl-adapter)
[![devDependencies](https://david-dm.org/tim-hellhake/prowl-adapter/dev-status.svg)](https://david-dm.org/tim-hellhake/prowl-adapter?type=dev)
[![optionalDependencies](https://david-dm.org/tim-hellhake/prowl-adapter/optional-status.svg)](https://david-dm.org/tim-hellhake/prowl-adapter?type=optional)
[![license](https://img.shields.io/badge/license-MPL--2.0-blue.svg)](LICENSE)

Pushes notifications to your device.

## Configuration
1. Go to https://www.prowlapp.com/api_settings.php
2. Click `Generate Key`
3. Add api key to config

## Usage
The addon registers a Prowl device with a `push(application, event)` action.

Currently, a rule can only trigger parameterless actions.

To send Prowl messages from a rule, you have to register an action with a predefined message.

Go to the settings of the addon and add an action with a name, a title and a body of your choice.

The Prowl devices now provide a new action with the specified name you can use in a rule.
