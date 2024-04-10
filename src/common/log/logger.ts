// Description: This file contains the logger configuration and custom logger functions
import { getLogger, configure } from 'log4js';
//configure logger
//type of appenders: console, file, dateFile, logLevelFilter, multiFile, stdout, stderr, cluster, log4js
//level of appenders: all, trace, debug, info, warn, error, fatal, mark, off
configure(
    {
        appenders: {          
            console: { type: "console" },
            app: {type: 'file', filename: 'log-history/log-history'}
        },
        categories: {
            default: {
                appenders: ["console"],
                level: 'all'
            },
            loggingException: {
                appenders: ['console', 'app'],
                level: 'warn', 
            }
        }
    }
);
//get logger
const logger = getLogger();

//custom trace logger
const traceLogger = (traceMessage: string, functionName:string)=>{

    logger.trace(`Function Name: ${functionName} Message: ${traceMessage}`);

}

//custom debug logger
const debugLogger = (debugMessage: string, functionName:string)=>{

    logger.debug(`Function Name: ${functionName} Message: ${debugMessage}`);

}

//custom info logger
const infoLogger = (infoMessage: string, functionName:string)=>{

    logger.info(`Function Name: ${functionName} Message: ${infoMessage}`);

}

const loggerException = getLogger('loggingException')

//custom error logger
const errorLogger = (error: Error, functionName:string)=>{

    let responseErrorMessage = error.message;
    loggerException.error(`Function Name: ${functionName} \n Message: ${responseErrorMessage} \n Stack: ${error.stack}`)

}

//custom warning logger
const warnLogger = (warnMessage: string, functionName:string)=>{

    loggerException.warn(`Function Name: ${functionName} Warning: ${warnMessage}`);    

}

//custom fatal logger
const fatalLogger = (error: Error, functionName:string)=>{

    loggerException.warn(`Function Name: ${functionName} Warning: ${error}`);    

}

export default {traceLogger, debugLogger, infoLogger, errorLogger,warnLogger, fatalLogger}