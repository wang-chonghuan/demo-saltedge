import { Newspaper, MessageCircle, Bot, LucideIcon } from 'lucide-react';
import News from '../pages/News';
import Chat from '../pages/Chat';
import Agents from '../pages/Agents';

interface RouteConfig {
  path: string;
  component: React.ComponentType;
  icon: LucideIcon;
  label: string;
}

export const routes: RouteConfig[] = [
  {
    path: '/news',
    component: News,
    icon: Newspaper,
    label: 'News'
  },
  {
    path: '/chat',
    component: Chat,
    icon: MessageCircle,
    label: 'Chat'
  },
  {
    path: '/agents',
    component: Agents,
    icon: Bot,
    label: 'Agents'
  },
];
