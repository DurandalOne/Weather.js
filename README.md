# Weather.js

A web application that generates the current weather as well as a seven day forcast. The location the user wants the weather for can either be entered manually though a location name or the user can click an icon to search their current location through the browser's Geolocation API. The user is also able to swap between celsius to fahrenheit by clicking on the appropriate section of the page.

## Lessons Learned

This is the first project in which I used the Fetch API with async/await. I found the idea of async/await relatively straightforward, what I did struggle with to start with is using .then to have to parse the JSON. Once I got a hang of it I ended up learning a lot about promises, async/await adn error handling. I enjoyed being able to manipulate the data from the JSON and display it in a meaningful way.

## Potential Future Features

- I would like to rebuild from the group up using react, I think this would be the ideal candidate for using components and state.

- Further to the above, I am aware that my API key is public in this project. I have researched hiding the API in vanilla JavaScript and was unable to find a way to accomplish this. I did find that you are able to hide the key using an .env file in React, this is something I would want to use going forward.

## Deployment

Deployed with [github pages](https://pages.github.com/).

## Get started

## Get started

No dependencies - to run locally, open the project directory with VSCode. Install the [Live Server extension](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) (if you haven't already) and click "Go Live" in the blue bar at the bottom of the screen. This will open a live development server in your browser that updates in response to code changes.
