# 



<!-- ABOUT THE PROJECT -->
## About The Project

https://assignments.reaktor.com/birdnest/?_gl=1*1w6n22b*_ga*MTA0Mzg1NTY5MC4xNjcwNjExNTMx*_ga_DX023XT0SX*MTY3MDYxMTUzMC4xLjEuMTY3MDYxMTU1MC40MC4wLjA.

Welcome to PROJECT BIRDNEST, a project aimed at preserving the nesting peace for a rare and endangered bird species, the Monadikuikka.

To preserve the nesting peace, authorities have declared the area within 100 meters of the nest a no drone zone (NDZ), but suspect some pilots may still be violating this rule.

The authorities have set up drone monitoring equipment to capture the identifying information broadcasted by the drones in the area, and have given you access to a national drone pilot registry. They now need your help in tracking violations and getting in touch with the offenders.

Frontend for this reposriotry can be found here https://github.com/tomppatomppa/birdnest-app
This repository contains all the necessary code and resources to set up and run the application.



### Built With


* Graphql
* Node.js
* MongoDb



<!-- GETTING STARTED -->
## Getting Started
Running the server locally

1. Clone the repo
   ```sh
   git clone https://github.com/tomppatomppa/birdnest-api.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your <strong>any</strong> API_KEY and MONGODB_URI into `.env`
   ```js
   const MONGODB_URI = "YOUR MONGODB URI"
   const API_KEY = 'ENTER API KEY';
   ```
5. Change the address in function sendRequestToGraphqlEndpoint found in utils.js, to your localhost port 
   ```
   fetch('https://localhost:XXXX/'
   ```
6. npm run dev



### _Running the server on for example Heroku_


1. Clone the repo
   ```sh
   git clone https://github.com/tomppatomppa/birdnest-api.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
4. Enter your <strong>any</strong> API_KEY and MONGODB_URI to your config variables in Heroku application settings https://devcenter.heroku.com/articles/config-vars
   ```sh
   MONGODB_URI = "YOUR MONGODB URI"
   API_KEY = 'ENTER YOUR API KEY';
   ```
5. Change the address in function sendRequestToGraphqlEndpoint found in utils.js, to your server address 
   ```
   fetch('https://yourserver.endpoint/'
   ```
6. ```See heroku documentation how to deploy https://devcenter.heroku.com/articles/git ```



<!-- USAGE EXAMPLES -->
## Usage


1. Drone data example in file 
   ```sh
   drone_example_data.xml
   ```
2. Pilot data example in file
   ```sh
    pilot_example_data.json
   ```



<!-- ACKNOWLEDGMENTS -->
## Acknowledgments

https://www.apollographql.com/docs/

