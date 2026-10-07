import type { IconName } from '../../Icon';
import { PersonId } from './people';

/* --------------------------------------------------------- notifications --- */

export type Notification = {
  id: string;
  icon: IconName;
  tone: 'blue' | 'orange' | 'plain';
  title: string;
  body: string;
  when: string;
  /** where tapping it goes */
  href: string | null;
  face: PersonId | null;
};

export const notifications: Notification[] = [
  {
    id: 'n1',
    icon: 'hand-heart',
    tone: 'orange',
    title: 'One spot left tonight',
    body: 'Padel doubles at Caddebostan needs a fourth at 19:30.',
    when: '12 min ago',
    href: '/activity/padel-caddebostan',
    face: null,
  },
  {
    id: 'n2',
    icon: 'star-fill',
    tone: 'orange',
    title: 'Two players are waiting on you',
    body: "Rate Sunday's padel — it takes about twenty seconds.",
    when: '2 h ago',
    href: '/rate',
    face: null,
  },
  {
    id: 'n3',
    icon: 'user-fill',
    tone: 'plain',
    title: 'Selin started following you',
    body: 'You have played together twice this month.',
    when: 'Yesterday',
    href: '/player/selin',
    face: 'selin',
  },
  {
    id: 'n4',
    icon: 'seal-check',
    tone: 'blue',
    title: 'Your padel level held at 4 stars',
    body: 'Nine of the last ten players said the level was spot on.',
    when: 'Tue',
    href: '/(tabs)/profile',
    face: null,
  },
  {
    id: 'n5',
    icon: 'calendar-check',
    tone: 'plain',
    title: 'Mert confirmed the pitch',
    body: '5-a-side at Moda Halı Saha is on for Thursday 21:00.',
    when: 'Mon',
    href: '/activity/five-a-side-moda',
    face: 'mert',
  },
];
