import { Artist } from '../entities/Artist';
import { Quote } from '../entities/Quote';
import { Translation } from '../entities/Translation';

export type Entry = Translation | Artist | Quote;
