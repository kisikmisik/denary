import SerialPort = require('serialport');
import { logger } from '../../api/serverHelpers/default.logger';

const WebSocket = require("ws");
let websocket

const Server = new WebSocket.Server({port: 3033})
Server.on("connection", ws => {
    websocket = ws
})

let sendMessage = (websocket, message) => {
    websocket.send(message)
}

export class SerialPortTool {
    private coinReaderPort: any;
    private buttonsPort: any;
    private parser: any;
    constructor() {
    }

    public async openCoinReaderPort() {
        return new Promise((resolve, reject) => {
        const Port: string = process.env.COM_PORT_READER || "n/a";
        if (Port.includes("n/a")) {
            reject("COM Port for coin control device is not configured");
            }
        this.coinReaderPort =  new SerialPort(Port, {autoOpen: true ,baudRate: 9600});
        this.coinReaderPort.on('open', () => this.opened(resolve))
        this.coinReaderPort.on('data', (data) => this.read(data));
        this.coinReaderPort.on('error',  (err: { message: any; }) => this.erroreded(reject, err  ))
        this.coinReaderPort.on('close',  (err: { message: any; }) => this.closeded( ))
        });
    }

    public async openButtonsPort() {
        return new Promise((resolve, reject) => {
        const Port: string = process.env.COM_PORT_BUTTONS || "n/a";
        if (Port.includes("n/a")) {
            reject("COM Port for coin control device is not configured");
            }
        this.buttonsPort =  new SerialPort(Port, {autoOpen: true ,baudRate: 9600});
        this.buttonsPort.on('open', () => this.opened(resolve))
        this.buttonsPort.on('data', (data) => this.readButtonsData(data));
        this.buttonsPort.on('error',  (err: { message: any; }) => this.erroreded(reject, err  ))
        this.buttonsPort.on('close',  (err: { message: any; }) => this.closeded( ))
        });
    }

    private  read(input: Buffer) { 
        const readet = input.toString();
        if (readet.includes("$")) { 
            sendMessage(websocket, "coinReaderAction")
        }
    }

    private readButtonsData (input: Buffer) {
        const readet = input.toString();
        if (readet.includes("a")) { 
            sendMessage(websocket, "buttonAction")
        } else if (readet.includes("b")) {
            sendMessage(websocket, "leverAction")
        }
    }

    private  opened(callback: any) {
        logger.debug("Port is opened");
        callback();
    }
    private  erroreded(rejectFunc: any, message) {
        logger.debug("Port is errored");
        rejectFunc(message)
    }
    private  closeded() {
        logger.debug("Port is closed");
    }    
}

// public async readCode(){
//     return new Promise((resolve, reject) => {
//     logger.info("Reading");
//     this.port.on('data', (data: { message: any; }) => resolve(data));
//     });
// }