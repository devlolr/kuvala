/**
 * Shared types for Sanity CMS documents
 */

export type LocationCategory = 'temple' | 'devasthan' | 'chabutro' | 'panjrapole' | 'other';

export interface HeritageLocation {
  _id:          string;
  title:         string;
  slug:          string;
  category:      LocationCategory;
  excerpt?:      string;
  image?:        string;
  foundedYear?:  string;
  deity?:        string;
  managingTrust?: string;
  location?:     string;
  description?:  any[]; // Portable Text
  history?:      any[]; // Portable Text
  gallery?:      string[];
}

export interface AncestorRecord {
  _id:           string;
  Name:          {
    en: string;
    gu: string;
  };
  ParentID:      string | null;
  AlwaysVisible: boolean;
  pad?:          'Acharya' | 'Upadhaya' | 'Sadhu';
  bio?:          string;
}
