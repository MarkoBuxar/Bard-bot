import express from 'express';

export class ServerAPI {
    app: any;

    constructor() {
        this.app = express();
    }

    start() {
        this.app.get('/', (req, res) => {
            res.sendStatus(200);
        });

        this.app.listen(process.env.PORT || 3000, () => {
            console.log('Server started!');
        });
    }
}
