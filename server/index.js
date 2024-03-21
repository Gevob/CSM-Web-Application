'use strict';
/* importing web modules */
const express = require('express');
const session = require('express-session');
const { body, validationResult, check } = require('express-validator'); // validation middleware
const cors = require('cors');
const morgan = require('morgan');
const passport = require('passport');                              // authentication middleware
const LocalStrategy = require('passport-local');                   // authentication strategy (username and password)
/* importing dao for querying */
const userDao = require('./dao-users');
const pageDao = require('./dao-pages');

/*  define port to listen   */
const port = 3001;


// init express
const app = new express();
app.use(morgan('dev'));
app.use(express.json());
const corsOptions = {
  origin: 'http://localhost:5173',
  credentials: true,
};
app.use(cors(corsOptions));
app.use(session({
  // set up here express-session
  secret: "a secret phrase of your choice",
  resave: false,
  saveUninitialized: false,
}));// enable sessions in Express
// init Passport to use sessions

/*        SETTING PASSPORT        */

app.use(passport.initialize());
app.use(passport.authenticate('session'));
app.use('/static', express.static('static'));
passport.use(new LocalStrategy(function verify(email, password, callback) {
  userDao.getUser(email, password).then((user) => {
    if (!user)
      return callback(null, false, {
        messages: 'email o password errati'
      });
    return callback(null, user);
  });
}));

passport.serializeUser((user, cb) => {
  cb(null, user);
});
passport.deserializeUser((user, cb) => {
  return cb(null, user);
});


function isLoggedIn(req, res, next) { //middleware che controlla se l'utente è autenticato req.Isauthenticated è gestito da initialize
  if (req.isAuthenticated()) return next();
  return res.status(401).json({errors: ["Not authenticated"]});
}

/*        POST METHODS        */

app.post('/api/login',
  body("username", "username is not a valid email").isEmail(),
  body("password", "password must be a non-empty string").isString().notEmpty(),
  (req, res, next) => {
    // Check if validation is ok
    const err = validationResult(req);
    const errList = [];
    if (!err.isEmpty()) {
      errList.push(...err.errors.map(e => e.msg));
      return res.status(400).json({ errors: errList });
    }
    passport.authenticate('local', (err, user, info) => {
      if (err)
        return next(err);
      if (!user) {
        // display wrong login messages
        return res.status(401).json(info);
      }
      // success, perform the login
      req.login(user, (err) => {
        if (err)
          return next(err);

        // req.user contains the authenticated user, we send all the user info back
        // this is coming from userDao.getUser()
        return res.json(user);
      });
    })(req, res, next);
  });



  /* AGGIUNGE PAGINA */
  app.post('/api/addpage',
  isLoggedIn,
  body("title", "Title not should be null").isString().notEmpty(),
  body("date","Not a valid date").optional({ nullable: true, checkFalsy: true }).isDate(),
  body("author","Not a valid author").isString().notEmpty(),
  body("inputFields","Not valid input").custom( async (value, { req }) => {
    let headerCheck = false;
    let contentCheck = false;
    if(Array.isArray(value)){
      if(value.length > 0 && value.every( b => b.content !== "")){
        
        value.forEach((b) => {
          if(b.type === "header"){
            headerCheck = true;}
          if(b.type === "paragrafo" || b.type === "immagine"){
            contentCheck = true;
          }
        });}
      }
    if(!(contentCheck && headerCheck))      
     return res.status(400).json({errors: ["Bad request"]});
  }),
  async (req, res, next) => {
    // Check if validation is ok
    const err = validationResult(req);
    const errList = [];
    if (!err.isEmpty()) {
      errList.push(...err.errors.map(e => e.msg));
      return res.status(400).json({ errors: errList });
    }
      const page = {
        userId: req.user.id,
        title: req.body.title,
        date: req.body.date, 
        author: req.body.author
      };
      const inputFields = req.body.inputFields;
      pageDao.addPage(page).then( (idPage) => {
          pageDao.addBlocks(idPage,inputFields).then( (result) => {
            return res.json(result);
          }).catch((err ) => {
            return res.status(422).json({errors: err});
          });
      }).catch( (err) => {
        return res.status(422).json({errors: err});
      } );

    
  });


              /* GET METODS  */
  /* CHECK LOGGIN */

app.get('/api/isLogged', isLoggedIn,
    (req, res) => {
      const user = req.user;
      return res.json( user );
    }
  );


  app.get("/api/images",     (req, res) => {
    pageDao.getImages().then((rows) => res.json(rows)).catch((err) => res.status(500).json(err));
  });



    /* GET MY PAGES */
  app.get('/api/getmypages', isLoggedIn,
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
      }
      pageDao.getPages(req.user.id).then((pages) => 
        {
        res.json(pages)}).catch((err) => res.status(500).json(err));
    }
  );

  app.get('/api/loadpage/:pageId', isLoggedIn, [
    check('pageId').isNumeric(),
  ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
      }
      if(!req.user.type){
        pageDao.checkPossession(req.user.id, req.params.pageId).then( (page) => {
          pageDao.getBlocks(req.params.pageId).then((blocks) => {
            const title = page.title;
            const date = page.date;
            const author = page.author;
            const publish = page.publish;
            const totalPage = {title,date,author,publish,blocks};
            res.json(totalPage);
          }).catch((err) =>res.status(500).json(err));
        }).catch((err) =>res.status(500).json(err));
      }else{
        pageDao.superUserPage(req.params.pageId).then( (page) => {
          pageDao.getBlocks(req.params.pageId).then((blocks) => {
            const title = page.title;
            const date = page.date;
            const author = page.author;
            const publish = page.publish;
            const totalPage = {title,date,author,publish,blocks};
            res.json(totalPage);
          }).catch((err) =>res.status(500).json(err));
        }).catch((err) =>res.status(500).json(err));
      }
    }
  );

  app.get('/api/showpage/:pageId', [
    check('pageId').isNumeric(),
  ],
    (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(422).json({ errors: errors.array() });
      }
      pageDao.superUserPage(req.params.pageId).then( (page) => {
        pageDao.getBlocks(req.params.pageId).then((blocks) => {
          const title = page.title;
          const date = page.date;
          const author = page.author;
          const publish = page.publish;
          const totalPage = {title,date,author,publish,blocks};
          res.json(totalPage);
        }).catch((err) =>res.status(500).json(err));
      }).catch((err) =>res.status(500).json(err));
    }
  );


  app.delete('/api/pages/:id',
  isLoggedIn,
  [ check('id').isInt() ],
  async (req, res) => {
    try {
       pageDao.deleteBlocks(req.params.id).then( () => {
         pageDao.deletePage(req.params.id).then( () => {res.status(200).json({});}).catch( (err) => res(err));
      } ).catch( (err) => res(err));
      
    } catch (err) {
      res.status(503).json({ error: `Database error during the deletion of film ${req.params.id}: ${err} ` });
    }
  }
);

  // DELETE /api/session/current
// This route is used for loggin out the current user.
app.delete('/api/sessions/current', isLoggedIn,  (req, res) => {
  req.logout(() => {
    res.status(200).json({});
  });
});

app.get('/api/getpublicpages',
(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
  }
  pageDao.getPublicPages().then((pages) => 
    {
    res.json(pages)}).catch((err) => res.status(500).json(err));
}
);

app.get('/api/getallpages',
(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
  }
  pageDao.getAllPages().then((pages) => 
    {
    res.json(pages)}).catch((err) => res.status(500).json(err));
}
);

      /* PUT METHODS */
app.put('/api/edit/:pageId',
isLoggedIn,
[ check('pageId').isInt() ],
body("title", "Title not should be null").isString().notEmpty(),
body("date","Not a valid date").isDate({ format: 'YYYY-MM-DD' }),
body("author","Not a valid author").isString().notEmpty(),
body("inputFields","Not valid input").custom( async (value, { req }) => {
  let headerCheck = false;
  let contentCheck = false;
  
  if(Array.isArray(value)){
    if(value.length > 0 && value.every( b => b.content !== "")){
      
      value.forEach((b) => {
        if(b.type === "header"){
          headerCheck = true;}
        if(b.type === "paragrafo" || b.type === "immagine"){
          contentCheck = true;
        }
      });}
    }
  if(!(contentCheck && headerCheck))      
   return res.status(400).json({errors: ["Bad request"]});
}),
async (req, res, next) => {
  // Check if validation is ok
  const err = validationResult(req);
  const errList = [];
  if (!err.isEmpty()) {
    errList.push(...err.errors.map(e => e.msg));
    return res.status(400).json({ errors: errList });
  }

  let id = "";
  let author = "";
  if(req.user.type === 1){
     id = (await userDao.matchIdAuthor(req.body.author)).id;

     author = req.body.author;
  }else{
     id = req.user.id;
     author = req.user.name;
  }
  const page = {
    idUser: id,
    pageId: req.params.pageId,
    title: req.body.title,
    date: req.body.date, 
    author: author
  };
      const inputFields = req.body.inputFields;
      pageDao.updatePage(page).then( () => {
          pageDao.updateBlocks(req.params.pageId).then( (result) => {
            pageDao.addBlocks(req.params.pageId,inputFields).then( (result) => {
              return res.json(result);
            }).catch((err ) => {
              return res.status(422).json({errors: err});
            });
          }).catch((err ) => {
            return res.status(422).json({errors: err});
          });
      }).catch( (err) => {
        return res.status(422).json({errors: err});
      } );
  
}
);


app.put('/api/editcms',
isLoggedIn,
body("nameCMS", "Title not should be null").isString().notEmpty(),
async (req, res, next) => {
  // Check if validation is ok
  const err = validationResult(req);
  const errList = [];
  if (!err.isEmpty()) {
    errList.push(...err.errors.map(e => e.msg));
    return res.status(400).json({ errors: errList });
  }


  if(req.user.type === 1){
     pageDao.changeCMS(req.body.nameCMS).then( (result) =>{
      return res.json(result);
     }).catch( (err) => {
        return res.status(422).json({errors: err});
      } );
  }
}
);


app.get('/api/getauthors',isLoggedIn,
(req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
  }
  if(req.user.type === 1)
  userDao.getAllUser().then((author) => 
    {
    res.json(author)}).catch((err) => res.status(500).json(err));
  else
  res.status(500).json("Not valid");
}
);

app.get('/api/getcms',
(req, res) => {
  pageDao.getCMS().then((name) => 
    {
    res.json(name)}).catch((err) => res.status(500).json(err));
}
);

// activate the server
app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
