
# Entry Management System

This is a web-portal to register meetings and track member behaviour.
The interface allows users to host a meeting as well as check-in/out from a meeting. The backend is written using Node.js/Express.js and uses MongoDB for storage.
The key features are: 
* Email and SMS sent to host when visitor checks-in
* Email sent to visitor when visitor checks-out<br/>
<b>Note:</b> `Nexmo SMS API` is used to send SMS. Free subscription has been used, that allows SMS to be sent between `9:00am` and `9:00pm` only.

## Preview
### Web Portal
![GIF Preview](https://github.com/gauravragini/Entry-Management/blob/master/Screenshots/output1.gif)

### SMS and Email
<img src="https://github.com/gauravragini/Entry-Management/blob/master/Screenshots/Screenshot%20(25).png" width="300" height="600"/> <img src="https://github.com/gauravragini/Entry-Management/blob/master/Screenshots/Screenshot%20(26).png" width="300" height="600"/> <img src="https://github.com/gauravragini/Entry-Management/blob/master/Screenshots/Screenshot_2019-12-01-15-49-30-86.png" width="300" height="600"/>

## Technologies Used
### Front-End
* HTML
* CSS
* JS/jQuery
* Bootstrap

### Back-End
* Node.js/Express.js
* MongoDB (Hosted on [mongodb atlas](https://www.mongodb.com/cloud/atlas)) 

## Run Locally
### System Prerequistites
* node
* npm

### Using the code
* Clone this repo: `git clone `
* Run `npm install` to install dependencies
* `cd` into the repository root and start server: `node server.js`
* In the browser, navigate to url: `localhost:8080` to use the portal.
