import { configure, getLogger } from 'log4js';

const logLlevel: string = process.env.LOG_LEVEL || "debug";

configure({
    appenders: { 
        general_console: { type: "console" },
        dateFile: {
            type: 'dateFile',
            filename: `localDebugVending.log`,
            layout: { type: 'basic' },
            compress: true,
            daysToKeep: 14,
            keepFileExt: true
          }
        },
    categories: { 
        default: { appenders: ["general_console", "dateFile"], level: logLlevel },
        cavca: { appenders: ["general_console", "dateFile"], level: logLlevel } }
  });

// fetch logger and export
export const logger = getLogger("cavca");