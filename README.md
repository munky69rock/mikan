# MIKAN

hubot-like slack bot using [botkit](https://github.com/howdyai/botkit/)

## Usage

```sh
$ npm i -g yarn
$ yarn
$ token=[SLACK_TOKEN] npm start
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
$ npm run lint
$ npm run coverage
$ npm test # lint & coverage
```
