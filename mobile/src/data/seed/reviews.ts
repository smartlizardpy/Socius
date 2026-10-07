import type { ImageSourcePropType } from 'react-native';
import { img } from './images';
import { PersonId } from './people';

/* ----------------------------------------------------------------- rating -- */

/** The four tags on Rate.body.html, in order. The first two start selected. */
export const ratingTags = ['On time', 'Good to play with', 'Brought the balls', 'Sorted the court'];

/** Who you rate after the padel game, in the mockup's order. */
export const rateQueue: PersonId[] = ['selin', 'mert', 'deniz'];

/* ------------------------------------------------------------ past games --- */

export type PastGame = {
  id: string;
  title: string;
  /** the Games prompt headline, written whole so it can be translated whole */
  promptTitle: string;
  dateLine: string;
  venue: string;
  thumb: ImageSourcePropType;
  /** who was there, for the rating queue */
  players: PersonId[];
  /** already rated in the seed — the padel one is the outstanding job */
  rated: boolean;
};

export const pastGames: PastGame[] = [
  {
    id: 'past-padel-sunday',
    title: 'Padel · Doubles',
    promptTitle: "Rate Sunday's padel",
    dateLine: 'Sun 24 Aug',
    venue: 'Caddebostan',
    thumb: img.cardPadel,
    players: rateQueue,
    rated: false,
  },
  {
    id: 'past-tennis-singles',
    title: 'Tennis · Singles',
    promptTitle: "Rate Thursday's tennis",
    dateLine: 'Thu 21 Aug',
    venue: 'Fenerbahçe Parkı',
    thumb: img.thumbCourt,
    players: ['ayca'],
    rated: true,
  },
  {
    id: 'past-five-a-side',
    title: '5-a-side · Friendly match',
    promptTitle: "Rate Tuesday's five-a-side",
    dateLine: 'Tue 19 Aug',
    venue: 'Moda Halı Saha',
    thumb: img.cardPitch,
    players: ['mert', 'deniz'],
    rated: true,
  },
];

/* --------------------------------------------------------------- reviews --- */

export type Review = {
  id: string;
  by: PersonId;
  when: string;
  text: string;
  tags: string[];
};

export const reviewsFor: Record<PersonId, Review[]> = {
  deniz: [
    {
      id: 'r1',
      by: 'selin',
      when: '2 days ago',
      text: 'Booked the court, brought spare balls, and put us in even teams. Genuinely a 5.0 — no sandbagging.',
      tags: ['On time', 'Level as described'],
    },
    {
      id: 'r2',
      by: 'mert',
      when: 'last week',
      text: 'Turned up early to warm up and stayed to help clear the court. Easy game to be part of.',
      tags: ['On time', 'Good to play with'],
    },
  ],
  selin: [
    {
      id: 'r3',
      by: 'deniz',
      when: '3 days ago',
      text: 'Sets the pace on the front foot and keeps the whole court talking. Never once late.',
      tags: ['On time', 'Good to play with'],
    },
  ],
  mert: [
    {
      id: 'r4',
      by: 'ayca',
      when: '5 days ago',
      text: 'Organises the pitch, the bibs and the split without being asked. Plays hard, no arguments.',
      tags: ['Sorted the court', 'Good to play with'],
    },
  ],
  ayca: [
    {
      id: 'r5',
      by: 'selin',
      when: 'a week ago',
      text: 'Patient with anyone newer and still gives you a proper match. Would play again any week.',
      tags: ['Good to play with', 'Level as described'],
    },
  ],
};

/** Reviews other players have left on you. */
export const reviewsOfYou: Review[] = [
  {
    id: 'y1',
    by: 'mert',
    when: 'yesterday',
    text: 'Held the level all evening and covered the tram side without being asked. Good hands at the net.',
    tags: ['On time', 'Level as described'],
  },
  {
    id: 'y2',
    by: 'ayca',
    when: 'last week',
    text: 'Messaged ahead when the traffic looked bad, then got there first anyway.',
    tags: ['On time'],
  },
];
