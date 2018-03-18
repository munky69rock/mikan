# MIKAN

[![Greenkeeper badge](https://badges.greenkeeper.io/munky69rock/mikan.svg)](https://greenkeeper.io/)

hubot-like slack bot using [botkit](https://github.com/howdyai/botkit/)

## Usage

```sh
$ npm i -g yarn
$ yarn
$ token=[SLACK_TOKEN] yarn start
```

## Configuration

```sh
$ cat '{ "key": "value" }' > config.json
```
```js
console.log(controller.config.key); // value
```

## Testing

```sh
$ yarn run lint
$ yarn run coverage
$ yarn test # lint & coverage
```
