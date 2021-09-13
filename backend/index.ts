import config from 'config';
import dotenv from 'dotenv';
import { Bard } from './Bot/Bard';

// low view count not playing

dotenv.config();

const token: string | undefined = process.env.TOKEN;

if (!token) {
    throw new Error('Token not found');
}

new Bard(token, config);
