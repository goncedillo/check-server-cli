![Github Actions Status](https://github.com/goncedillo/check-server-cli/workflows/CheckServerCLI-workflow/badge.svg)  [![Coverage Status](https://coveralls.io/repos/github/goncedillo/check-server-cli/badge.svg?branch=master)](https://coveralls.io/github/goncedillo/check-server-cli?branch=master)

# Check Server CLI

> A CLI tool for checking out the servers availability. It is useful when are consuming an API or service which has different environments and you are not sure about its readiness.

## Dependencies

- You need to have [Node.js](https://nodejs.org/) v9+
- You need a terminal to launch the service

## How to use it

1. Install the package

    ```bash
    $ npm i check-server-cli
    ```

2. Provide a well-formed `config.json`
3. Run the start command `npx check-server-cli <OPTIONS>`

### Use it as global package  

1. Install the package

    ```bash
    $ npm i check-server-cli -g
    ```

2. Provide a well-formed `config.json`
3. Run the start command `check-server-cli <OPTIONS>`

## Configuration

The CLI expects a config file in *json* format, in order to provide the different server addresses, plus service information.

| Field | Explanation |
| ------ |------------|
| timer | Time in minutes. This is the period in which the tool will check every server provided |
| info.siteName | Name of my company, to show in visual report |
| info.picture | Company's logo url, to show in visual report |
| servers | Array of different servers to be checked as objects |
| server.name | Name to identify the server or environment |
| server.url | The server url to be checked |

You will find a `config.example.json` to start in an easier way.

## Command options

### Logger mode

You can run the CLI for getting statuses in a log file by the use of the `--logger` flag. The log file is located in **logs** folder by default.

```bash
$ check-server-cli --logger
```

Additionally, you might use `--output` path in order to define where will be saved the logs.

```bash
$ check-server-cli --logger --output ./my-logs-folder
```

### Web logger mode

The CLI exposes an optional web interface with the `--server` flag in order to check the servers statuses in a more confortable way.  
This is an additional feature which can be used together with the regular logger mode.

```bash
$ check-server-cli --server 
```

## Reports

#### Log file

You will file report files divided by dates in `logs` folder.  
These reports are plain text, just for getting a record of the status.

#### HTML report

The tools exposes a HTML report in which you can show the last status for each registered server.  
This CLI uses [serve](https://www.npmjs.com/package/serve) tool for running the static server, opening connection at `http://localhost:5000`