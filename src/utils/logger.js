import "dotenv/config";
import fs from "fs";

const logger = (req, res, next) => {
    const datetime_utc = new Date().toISOString().slice(0, 19).replace('T', ' ');
    const folder = process.env.LOGS_PATH || "logs";
    const filename = `${datetime_utc.slice(0, 10)}.log`;

    let log = `${req.connection.remoteAddress} - [${datetime_utc} UTC] "${req.method} ${req.url}"\n`;
    
    if (Object.keys(req.body).length) {
        log+= `Body: ${JSON.stringify(req.body)}\n`;
    }

    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }

    fs.appendFile(`${folder}/${filename}`, log, (err) => {
        if (err) {
            console.error('Error logger:', err);
        }
    });
  
    next();
};

export default logger;
