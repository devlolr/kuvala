import type { LocationCategory } from '@/lib/theme';

export interface HeritageLocation {
  _id:         string;
  title:        string;
  slug:         string;
  category:     LocationCategory;
  excerpt?:     string;
  image?:       string;
  foundedYear?: string;
}

export const MOCK_LOCATIONS: HeritageLocation[] = [
  { _id: 'loc-1', title: 'Shiva Temple',        slug: 'shiva-temple',   category: 'temple',     foundedYear: '1680', excerpt: 'The oldest and most sacred temple in Kuvala, dedicated to Lord Shiva.' },
  { _id: 'loc-2', title: 'Hanuman Temple',       slug: 'hanuman-temple', category: 'temple',     foundedYear: '1750', excerpt: "Built by the village founder's son, embodying devotion and community service." },
  { _id: 'loc-3', title: 'Ram Mandir',           slug: 'ram-mandir',     category: 'temple',     foundedYear: '1820', excerpt: 'A beautifully carved temple complex hosting annual Ram Navami festivals.' },
  { _id: 'loc-4', title: 'Devasthan Complex',    slug: 'devasthan-1',    category: 'devasthan',  foundedYear: '1900', excerpt: 'The central religious complex serving the entire village community.' },
  { _id: 'loc-5', title: 'Chabutro Bird Tower',  slug: 'chabutro',       category: 'chabutro',   foundedYear: '1860', excerpt: "An ornate feeding tower — a symbol of Kuvala's love for all living beings." },
  { _id: 'loc-6', title: 'Panjrapole Shelter',   slug: 'panjrapole',     category: 'panjrapole', foundedYear: '1875', excerpt: 'A sanctuary providing care and refuge for cows and other animals.' },
];
