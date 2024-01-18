import pool from "../../database/connection.js";
import format from 'pg-format';

const getJoyas = async ({ 
    order_by = "nombre_ASC", limits = 10, page = 1,
    precio_min, precio_max, categoria, metal }) => {

    try {
        const where = []
        const values = [];

        const [orderByColumn, OrderByDirection] = order_by.split("_");
        const orderByColumns = ["id", "nombre", "categoria", "metal", "precio", "stock"];

        const isOrderByValid = orderByColumns.includes(orderByColumn) && ["ASC", "DESC"].includes(OrderByDirection.toUpperCase());
        const isPageValid  = Number.isInteger(Number(page)) && Number(page) >= 1;
        const isLimitValid = Number.isInteger(Number(limits)) && Number(limits) <= 10;

        if (!isOrderByValid || !isPageValid || !isLimitValid) {
            throw new Error("Error in parameters");
        }

        const offset = (page - 1) * limits;

        let sql = `
            SELECT 
                id,
                nombre,
                categoria,
                metal,
                precio,
                stock
            FROM
                inventario`;

        if (precio_min) {
            /*
            where.push(`precio >= $${values.length + 1}`);
            values.push(precio_min);
            */
            where.push(format('precio >= %L', precio_min));
        }

        if (precio_max){
            /*
            where.push(`precio <= $${values.length + 1}`);
            values.push(precio_max);
            */
            where.push(format('precio <= %L', precio_max));
        }

        if (categoria) {
            /*
            where.push(`categoria = $${values.length + 1}`);
            values.push(categoria);
            */
            where.push(format('categoria = %L', categoria));
        }

        if (metal) {
            /*
            where.push(`metal = $${values.length + 1}`);
            values.push(metal);
            */
            where.push(format('metal = %L', metal));
        }

        if (where.length) {
            /*
            sql += ` WHERE ${where.join(" AND ")}`;
            */
            sql += format(' WHERE %s', where.join(" AND "));
        }

        /*                        
        sql+= ` ORDER BY ${orderByColumn} ${OrderByDirection}
                LIMIT $${values.length + 1} OFFSET $${values.length + 2}`;
                values.push(limits);
                values.push(offset);
        */
        sql += format(` ORDER BY %I %s 
                        LIMIT %s OFFSET %s`, orderByColumn, OrderByDirection, limits, offset);

        const joyas = await pool.query(sql, values);
        return joyas.rows;
    } catch (error) {
        throw new Error(error.message);
    }
};

const getJoyasHATEOAS = async(joyas, max = 10) => {
    /*
    //Totales Globales
    const sql = `
        SELECT
            COUNT(*) AS total_joyas,
            SUM(inventario.stock) AS total_stock
        FROM
            inventario`;

    const result = await pool.query(sql);
    const totalJoyas = Number(result.rows[0].total_joyas);
    const stockTotal = Number(result.rows[0].total_stock);
    */

    //Totales Filtrados
    const totalJoyas = joyas.length;
    const stockTotal = joyas.reduce((acc, joya) => acc + joya.stock, 0);

    
    const results = joyas.map((joya) => {
        return {
            name : joya.nombre,
            href : `/joyas/joya/${joya.id}`
        };
    }).slice(0, max);

    return {
        totalJoyas : totalJoyas,
        stockTotal : stockTotal,
        results    : results
    };
};

export const joyasModel = { getJoyas, getJoyasHATEOAS };
