import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface TrainerInterface {
  id?: string;
  availability: string;
  qualifications: string;
  experience: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface TrainerGetQueryInterface extends GetQueryInterface {
  id?: string;
  availability?: string;
  qualifications?: string;
  experience?: string;
  user_id?: string;
}
