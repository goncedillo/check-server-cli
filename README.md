# Check Server CLI

> A CLI tool for checking out the readyness of a server. It is useful when are consuming an API or service which has different environments and you are not sure about its availability.

## Dependencies

- You need to have [Node.js](https://nodejs.org/) v9+
- You need a terminal to launch the service

## How to use it

1. Install the tool  
    ```bash
    $ npm i check-server-cli
    ```
2. Provide a well-formed `config.json`
3. Run the start command `npm start`

## Configuration

The CLI expects a config file in *json* format, in order to provide the different server addresses, plus service information.  

```json
{
    // Time in minutes. This is the period in which the tool will check every server provided
    "timer": 5,
    // Company info (only for visual motivations)
    "info": {
        // Name of my company, to show in visual report
        "siteName": "My Awesome Company",
        // Company's logo url, to show in visual report
        "picture": "http://mylogo.jpg"
    },
    // Array of different servers to be checked
    "servers": [
        {
            // Name to identify the server o environment
            "name": "Server #1",
            // The server url to be checked
            "url": "http://serverurl.com"
        },
        {
            ...
        }
    ]
}
```

You will find a `config.exemple.json` to start in a easier way.

## Reports

#### Log file

You will file report files divided by dates in `static/logs` folder.  
These reports are plain text, just for getting a record of the status.

#### HTML report

The tools exposes a HTML report in which you can show the last status for each registered server.  
This CLI uses [serve](https://www.npmjs.com/package/serve) tool for running the static server, opening connection at `http://localhost:5000`