
const error404 = async(req, res) => {
    res.status(404).json({ error: "Resource not found" });
};

export const errorController = { error404 };
