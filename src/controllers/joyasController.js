import {joyasModel} from '../models/joyasModel.js';

const getJoyas = async(req, res) => {
    try {
        const joyas = await joyasModel.getJoyas(req.query);        
        const joyasHATEOAS = await joyasModel.getJoyasHATEOAS(joyas)
        console.log("OK:", joyasHATEOAS);
        return res.status(200).json(joyasHATEOAS);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Error processing request" });
    }
};

const getJoyasFiltros = async(req, res) => {
    try {
        const joyas = await joyasModel.getJoyas(req.query);
        console.log("OK:", joyas);
        return res.status(200).json(joyas);
    } catch (error) {
        console.error("Error:", error);
        return res.status(500).json({ error: "Error processing request" });
    }
};

export const joyasController = { getJoyas, getJoyasFiltros };
