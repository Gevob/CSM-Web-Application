'use strict';
const db = require('./db');

const dayjs = require('dayjs');
exports.addPage = (page) => {

    return new Promise((res,rej) => {
        const today = dayjs().format("YYYY-MM-DD");
        const query = 'INSERT INTO PAGES ( idUser, date, publish, title, author) VALUES(?, ?, ?, ?, ?)';
        const param = [page.userId, page.date, today, page.title, page.author];
        db.run(query,param, function (err) {
            if(err){
                console.log('Errore in chiamata: '+err);
                rej(err);
            }
            else{
                res(this.lastID);
            }
        });
    });
};

exports.addBlocks = (idPage,inputFields) => {
    
    return new Promise((res,rej) => {
        inputFields.forEach( (block,index) => {
            const param = [idPage, index, block.content, block.type];  
            const query = 'INSERT INTO BLOCKS ( IdPage, position, content, type) VALUES(?, ?, ?, ?)';
            db.run(query,param, function (err) {
                if(err){
                    console.log("error in run: ",err.message);
                    rej(err);
                }
            });
            
        });
        res(idPage);
    });
};

exports.getPages = (userId) => {
    return new Promise ( (res,rej) => {
        const query = 'SELECT * FROM PAGES WHERE idUser = ?';
        db.all(query,[userId],(err,rows) => {
            if(err){
                console.log("Error in mypages: ",err);
                rej(err);
            }
            res(rows);
        });
    });
  };

  exports.deleteBlocks = (id) => {
    return new Promise ( (resolve,reject) => {
        const query = 'DELETE FROM BLOCKS WHERE IdPage = ?';
        
        db.run(query,[id], (err) =>{
            if(err){
                console.log('Errore in chiamata: '+err);
                reject(err);
            }
            else{
                resolve();
            }
        })
    });
}

exports.deletePage = (id) => {
    return new Promise ( (resolve,reject) => {
        const query = 'DELETE FROM PAGES WHERE idPages = ?';
        
        db.run(query,[id], (err) =>{
            if(err){
                console.log('Errore in chiamata: '+err);
                reject(err);
            }
            else{
                resolve();
            }
        })
    });
}

exports.checkPossession = (userId,pageId) => {
    return new Promise ( (res,rej) => {
        const query = 'SELECT * FROM PAGES WHERE idUser = ? AND idPages = ?';

        db.get(query,[userId,pageId],(err,row) => {
            if(err){
                console.log("Error in mypages: ",err);
                rej(err);
            }
            res(row);
        });
    });
  };

  exports.getBlocks = (pageId) => {
    return new Promise ( (res,rej) => {
        const query = 'SELECT * FROM BLOCKS WHERE IdPage = ? ORDER BY position';
        db.all(query,[pageId],(err,rows) => {
            if(err){
                console.log("Error in mypages: ",err);
                rej(err);
            }
            res(rows);
        });
    });
  };

  exports.superUserPage = (pageId) => {
    return new Promise ( (res,rej) => {

        const query = 'SELECT * FROM PAGES WHERE idPages = ?';

        db.get(query,[pageId],(err,row) => {
            if(err){
                console.log("Error in mypages: ",err);
                rej(err);
            }
                        res(row);
        });
    });
  };

  exports.updatePage = (page) => {
    
    return new Promise((res,rej) => {
        const query = 'UPDATE PAGES SET date = ?, title = ?, author = ?, idUser = ? WHERE idPages = ?';
        const param = [page.date, page.title, page.author, page.idUser, page.pageId];
        db.run(query,param, function (err) {
            if(err){
                console.log('Errore in chiamata: '+err);
                rej(err);
            }
            else{
                res(this.lastID);
            }
        });
    });
};

exports.updateBlocks = (idPage) => {
    return new Promise ( (resolve,reject) => {
        const query = 'DELETE FROM BLOCKS WHERE IdPage = ?';
        
        db.run(query,[idPage], function (err) {
            if(err){
                console.log('Errore in chiamata: '+err);
                reject(err);
            }
            else{
                resolve(this.changes);
            }
        })
    });
};

exports.getImages = () => {
    return new Promise ( (resolve,reject) => {
        const query = 'SELECT name FROM IMAGES';
        db.all(query,  (err,rows) => {
            if(err){
                console.log('Errore in chiamata: '+err);
                reject(err);
            }
            else{
                resolve(rows);
            }
        })
    });
};

exports.getPublicPages = () => {
    return new Promise ( (res,rej) => {
        const today = dayjs().format("YYYY-MM-DD");
        const query = 'SELECT * FROM PAGES WHERE  date <= ? AND date <> "" ORDER BY date';
        db.all(query,[today],(err,rows) => {
            if(err){
                console.log("Error in mypages: ",err);
                rej(err);
            }
            
            res(rows);
        });
    });
  };

  exports.getAllPages = () => {
    return new Promise ( (res,rej) => {
        const query = 'SELECT * FROM PAGES';
        db.all(query,(err,rows) => {
            if(err){
                console.log("Error in mypages: ",err);
                rej(err);
            }
            res(rows);
        });
    });
  };

  exports.getCMS = () => {
    return new Promise ( (res,rej) => {
        const query = "SELECT nome FROM GENERAL WHERE label = 'titolo'";
        db.all(query,(err,rows) => {
            if(err){
                rej(err);
                console.log("err: ",err);
            }
            res(rows);
        });
    });
  };


  exports.changeCMS = (name) => {
    return new Promise ( (res,rej) => {
        const query = "UPDATE GENERAL SET nome = ? WHERE label = 'titolo'";
        db.run(query,[name],function (err) {
            if(err){
                rej(err);
                console.log("err: ",err);
            }
            res(this.changes);
        });
    });
  };