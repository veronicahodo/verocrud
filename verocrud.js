"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql = __importStar(require("mysql2/promise"));
class VeroCrud {
    constructor(username, password, database, host = "localhost") {
        this.pool = mysql.createPool({
            host: host,
            user: username,
            password: password,
            database: database,
        });
        this.maxResults = 20000; // Change as needed. If you have larger record sets increase this
    }
    insertString(data) {
        // This builds the string of fields and values necessary
        // for SQL
        // TODO: I know we should trust our code to be used properly
        // but I can't help but think we should do some sanitization
        // on these fields
        let fields = [];
        let values = [];
        for (const item of data) {
            Object.entries(item).forEach(([key, value]) => {
                fields.push(key);
                values.push(value);
            });
        }
        return `(${fields.join(",")}) VALUES ('${values.join("','")}')`;
    }
    updateString(data) {
        // This builds the update string
        // TODO: same security concerns as insert
        let fields = [];
        let values = [];
        let returnStr = "";
        for (const item of data) {
            Object.entries(item).forEach(([key, value]) => {
                fields.push(key);
                values.push(value);
            });
        }
        for (var i = 0; i < fields.length; i++) {
            if (i > 0) {
                returnStr += ", ";
            }
            returnStr += `${fields[i]}="${values[i]}"`;
        }
        return returnStr;
    }
    criteriaToString(criteria, orOperand = false) {
        // This function converts an array of arrays to an SQL
        // query critera. Expects each criteria to be in its
        // own 3 element array within the parent array. Default
        // is to join each of these with an AND statement. Setting
        // orOperand true replaces that with OR
        /* [
          [{
            field,      -- appropriate column name
            operand,    -- operator. =,<,>,LIKE
            value       -- value to compare
          }]
        ]
        */
        let returnStr = "(";
        let count = 0;
        const operand = orOperand ? "OR" : "AND";
        for (const item of criteria) {
            if (count > 0) {
                returnStr += ` ${operand} `;
            }
            returnStr += `${item[0]} ${item[1]}'`;
            if (item[1].toLowerCase() === "like") {
                returnStr += `%${item[2]}%'`;
            }
            else {
                returnStr += `${item[2]}'`;
            }
            count++;
        }
        return returnStr + ")";
    }
    async create(table, data) {
        // Creates a new entry in the database
        const connection = await this.pool.getConnection();
        try {
            const sql = `INSERT INTO \`${table}\` ${this.insertString(data)}`;
            console.log(sql);
            await connection.query(sql);
        }
        catch (error) {
            throw error;
        }
        finally {
            connection.release();
        }
    }
    async read(table, criteria) {
        // Performs a pretty flexible select statement coupled with
        // criteriaToString.
        const connection = await this.pool.getConnection();
        try {
            let sql = `SELECT * FROM \`${table}\` WHERE ${this.criteriaToString(criteria)} LIMIT ${this.maxResults}`;
            console.log(sql);
            const [rows] = await connection.query(sql);
            if (rows.length > 0) {
                console.log(rows);
                return rows[0];
            }
            else {
                return null;
            }
        }
        catch (error) {
            throw error;
        }
        finally {
            connection.release();
        }
    }
    async update(table, data, criteria) {
        const connection = await this.pool.getConnection();
        try {
            let sql = `UPDATE ${table} SET ${this.updateString(data)} ` +
                `WHERE ${this.criteriaToString(criteria)}` +
                ` LIMIT ${this.maxResults} `;
            console.log(sql);
            await connection.query(sql);
        }
        catch (error) {
            throw error;
        }
        finally {
            connection.release();
        }
    }
    async delete(table, criteria) {
        const connection = await this.pool.getConnection();
        try {
            let sql = `DELETE FROM ${table} WHERE ${this.criteriaToString(criteria)} LIMIT ` +
                this.maxResults;
            await connection.query(sql);
        }
        catch (error) {
            throw error;
        }
        finally {
            connection.release();
        }
    }
}
exports.default = VeroCrud;
