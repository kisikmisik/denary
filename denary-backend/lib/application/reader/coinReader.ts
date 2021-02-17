import {  SerialPortTool } from "../../application/serial/serialCommons";

export async function coinReader(){
    console.log("reading from console");
    const serialPort = new SerialPortTool();
    await serialPort.openCoinReaderPort();
    await serialPort.openButtonsPort();

}    

