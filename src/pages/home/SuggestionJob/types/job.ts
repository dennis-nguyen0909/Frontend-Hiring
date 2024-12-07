export type JobType = 'FULL-TIME' | 'PART-TIME' | 'INTERNSHIP';

export interface Job {
  id: string;
  title: string;
  type: JobType;
  salary: {
    min: number;
    max: number;
  };
  company: {
    name: string;
    logo: string;
  };
  location: {
    city: string;
    country: string;
  };
  isSaved?: boolean;
}

