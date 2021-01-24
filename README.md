# Color of Berlin Palette ![PREVIEW](https://img.shields.io/badge/DRAFT-blue)

The `Color of Berlin Palette` project fetches colors of the sky in Berlin from the [Color of Berlin](https://twitter.com/colorofberlin) Twitter account and creates a color palette.

## How to install

Clone the project and install dependencies:

```
> git https://github.com/alenakhineika/color-of-berlin-palette .
> npm i
```

Accessing the Twitter APIs requires a set of credentials that you must pass with each request. To generate these keys and tokens you should:

- [Apply for a Twitter developer account](https://developer.twitter.com/en/apply-for-access.html)
- [Create a new Twitter Project and App](https://developer.twitter.com/en/portal/projects-and-apps)

You will find the required secrets in the Twitter App settings. In the `Color of Berlin Palette` project root, create the `.env` file and assign these Twitter secrets to the following environment variables:

```
TWITTER_CONSUMER_API_KEY=
TWITTER_CONSUMER_API_KEY_SECRET=
TWITTER_BEARER_TOKEN=
```

You also need MongoDB installed to run the project: https://docs.mongodb.com/manual/installation/

If you don't want to create a Twitter developer account, you can use the `tweets-sample-dataset-200.json` from the `public` folder in the root directory of the project. Connect to `mongodb://localhost`, create the `colorofberlin` database with the `tweets` collection, and import the sample JSON to MongoDB.

## How to fetch data

### Fetch tweets and save them to MongoDB

If you received your Twitter consumer keys and authentication tokens use the following script to fetch tweets from the `Color of Berlin` Twitter account and save them to MongoDB:

```
> npm run save-tweets-to-mongodb
```

The script fetches all available tweets, or if you run it more than once only new tweets and saves them to the `colorofberlin.tweets` collection.

> Note that the [`statuses/user_timeline`](https://developer.twitter.com/en/docs/twitter-api/v1/tweets/timelines/api-reference/get-statuses-user_timeline) method can only return up to 3,200 of a user's most recent tweets.

### Fetch tweets and save them to the file system

There is also an option to save tweets to the file system and use them outside of this project. The following script fetches all available tweets and saves them as a new JSON file to the `out` folder in the root directory of the project:

```
> npm run save-tweets-to-file
```

## Run the project

Start the server and the client in development mode:

```
> npm run start:dev
```

The server is running with nodemon and the client is served by Webpack Dev Server with hot reloading enabled. The `http://localhost:3000/` page will be automatically opened in a web browser.
