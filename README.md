# Color of Berlin Palette

> Inspired by [Color of Berlin](https://twitter.com/colorofberlin) Twitter account.

The `Color of Berlin Palette` project creates color palettes of Berlin's sky.

## How to install

Clone the project and install dependencies:

```
> git clone git@github.com:alenakhineika/color-of-berlin-palette.git .
> npm i
```

You need [MongoDB](https://docs.mongodb.com/manual/installation/) installed and `data/berlin-colors-sample.json` to run the project. Connect to `mongodb://localhost`, create the `coloroflocation` database with the `colors` collection, and import the sample JSON to MongoDB.

## Run the project

Build and start the project at `http://localhost:3000/`:

```
> npm run build
> npm start
```

## Features

- Webpack 4
- React 16
- Server-side Rendering
- Server-side Routing
- Express
- TypeScript
- Less
- Bootstrap
- Eslint
- Prettier
- Mocha
- Chai
