Installations needed:
====================

1) VS Code https://code.visualstudio.com/ or any other IDE which supports JS debugging
2) Node.js https://nodejs.org/en/
3) Git
    https://git-scm.com/book/en/v2/Getting-Started-Installing-Git
    https://git-scm.com/book/en/v2/Getting-Started-First-Time-Git-Setup
4) Authetication implementation: http://thejackalofjavascript.com/architecting-a-restful-node-js-app/
5) SPA vs MPA https://medium.com/@NeotericEU/single-page-application-vs-multiple-page-application-2591588efe58
6) No ORM: http://seldo.com/weblog/2011/06/15/orm_is_an_antipattern


Structure for reference:
=======================
project/
   node_modules/
   config/
      db.js                //Database connection and configuration
      credentials.js       //Passwords/API keys for external services used by your app
   models/                 //For mongoose schemas
      users.js
      things.js
   routes/                 //All routes for different entities in different files 
      users.js
      things.js
   app.js
   routes.js               //Require all routes in this and then require this file in 
   app.js 
   package.json