# Color of Berlin Palette

> Inspired by [Color of Berlin](https://twitter.com/colorofberlin) Twitter account.

The `Color of Berlin Palette` project creates color palettes of Berlin's sky.

## How to install

Clone the project and install dependencies:

```
> git clone git@github.com:alenakhineika/color-of-berlin-palette.git .
> npm i
```

You need [MongoDB](https://docs.mongodb.com/manual/installation/) installed. Connect to `mongodb://localhost`, create the `coloroflocation` database with the `colors` collection, and import the `data/berlin-colors-sample.json` sample dataset to MongoDB. Refer to `.env.example` to overwrite the default configuration.

## Run the project

Build and start the project at `http://localhost:3000/`:

```
> npm run build
> npm start
```

## Features

- Webpack 5
- React 18
- TypeScript 5
- Server-side Rendering
- Server-side Routing
- Express
- Less
- Bootstrap
- Eslint
- Prettier
- Mocha
- Chai
