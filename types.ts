export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface BeforeAfterItem {
  id: string;
  title: string;
  description: string;
  beforeImg: string;
  afterImg: string;
  category: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
}

export enum Theme {
  LIGHT = 'light',
  DARK = 'dark',
}