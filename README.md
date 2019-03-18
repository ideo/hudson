# IDEO HUDSON

Hudson is a tool that helps IDEO collect user insights. Both front-end and back-end are written in JavaScript.
The front-end is a [Progressive Web App](https://medium.com/@amberleyjohanna/seriously-though-what-is-a-progressive-web-app-56130600a093) uses [Next.js](https://nextjs.org/) which is a universal React framework and the backend leverages Node.js based headless CMS [Strapi](https://strapi.io)

### Developing Frontend
```bash
cd ./frontend
yarn # or `npm install`
yarn dev 
```
This will open the project on `localhost:3000` and enable Hot Module Replacement.

### Developing Backend
Install `strapi` globally: `yarn global add strapi@alpha` or `npm install strapi@alpha -g`
```bash
cd ./backend
strapi start
```
This will start the backend app on `localhost:1337`  and watch all source files for changes.
Admin is by default located at `localhost:1337/admin`
Backend uses [Postgres](http://postgresql.org) as database.
