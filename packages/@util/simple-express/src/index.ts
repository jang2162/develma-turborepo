import { createServer } from 'http';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Express } from 'express';

export function createExpressServer(option: { port: number }) {
    const app: Express = express();
    const httpServer = createServer(app);
    return {
        app,
        httpServer,
        start: new Promise<void>((resolve) => httpServer.listen(option.port, resolve)),
    };
}

type bodyParserOption =
    | { type: 'json'; options: bodyParser.OptionsJson }
    | { type: 'raw'; options: bodyParser.Options }
    | { type: 'text'; options: bodyParser.OptionsText }
    | { type: 'urlencoded'; options: bodyParser.OptionsUrlencoded };

function getBodyParser(option: bodyParserOption) {
    switch (option.type) {
        case 'json':
            return bodyParser.json(option.options);
        case 'raw':
            return bodyParser.raw(option.options);
        case 'text':
            return bodyParser.text(option.options);
        case 'urlencoded':
            return bodyParser.urlencoded(option.options);
    }
}
export function simpleExpressMiddleware(option: {
    body?: boolean | bodyParserOption;
    cookie?:
        | boolean
        | {
              secret?: string | string[];
              options?: cookieParser.CookieParseOptions;
          };
    cors?: boolean | cors.CorsOptions;
}): any[] {
    return [
        option.cors === false ? null : option.cors === true || option.cors === undefined ? cors() : cors(option.cors),
        option.cookie === false
            ? null
            : option.cookie === true || option.cookie === undefined
            ? cookieParser()
            : cookieParser(option.cookie.secret, option.cookie.options),
        option.body === false
            ? null
            : option.body === true || option.body === undefined
            ? bodyParser.json()
            : getBodyParser(option.body),
    ].filter((item) => item !== null);
}
