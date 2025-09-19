export type TimeUnit = 'seconds' | 'minutes' | 'hours' | 'days' | 'weeks' | 'months';

export interface RevisionSettings {
  interval: number;
  unit: TimeUnit;
}

export interface FlashcardData {
  id: string;
  front: string;
  back: string;
  createdAt: Date;
  userId?: string;
  nextRevision?: Date;
  revisionInterval?: number; // in days (legacy support)
  revisionSettings?: RevisionSettings; // new flexible revision settings
  lastReviewed?: Date;
  reviewCount?: number;
}
