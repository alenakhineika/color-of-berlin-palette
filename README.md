# Color of Berlin Analyzer

A project fetches colors of the sky in Berlin for a given period of time from the [Color of Berlin](https://twitter.com/colorofberlin) account.

## How to install

Clone the project and install dependencies.

```
> git https://github.com/alenakhineika/color-of-berlin-analyzer .
> npm i
```

Accessing the Twitter APIs requires a set of credentials that you must pass with each request. To generate these keys and tokens you should:

- [Apply for a developer account](https://developer.twitter.com/en/apply-for-access.html)
- [Create a new Project and App](https://developer.twitter.com/en/portal/projects-and-apps)

You will find the generated consumer key and authentication tokens in the project settings.

In the project root, create the `.env` file and assign secrets to the following environment variables:

```
TWITTER_CONSUMER_API_KEY=
TWITTER_CONSUMER_API_KEY_SECRET=
TWITTER_AUTHENTICATION_ACCESS_TOKEN=
TWITTER_AUTHENTICATION_ACCESS_TOKEN_SECRET=
```
