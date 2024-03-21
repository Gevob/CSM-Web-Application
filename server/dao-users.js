'use strict';
const db = require('./db');
const crypto = require('crypto');

exports.getUser = (email,password) => {
    console.log('ci entro');
    return new Promise((res,rej) => {
        const sql = 'SELECT * FROM USERS WHERE email = ?';
        db.get(sql, [email],(err,row)=>{
            if(err){ rej(err);}
            else if (row === undefined) { res(false); }
            else {
                const user = {id: row.id, username: row.email, name: row.nome, type: row.type};
                const salt = row.salt;
                console.log('user nel backend: ',user);
                crypto.scrypt(password, salt, 32, (err, hashedPassword) => {
                if (err) rej(err);
                if(!crypto.timingSafeEqual(Buffer.from(row.password,'hex'), hashedPassword))
                    res(false);
                else res(user); 
                });
                }
        });      
    });
};

exports.getAllUser = () => {
    return new Promise((res,rej) => {
        const sql = 'SELECT nome FROM USERS';
        db.all(sql,(err,rows)=>{
            if(err){ rej(err);}
            
                res(rows);
                
        });      
    });
};

exports.matchIdAuthor = (name) => {
    return new Promise((res,rej) => {
        const sql = 'SELECT id FROM USERS WHERE nome = ?';
        db.get(sql,[name],(err,rows)=>{
            if(err){ rej(err);}
            
                res(rows);
                
        });      
    });
};