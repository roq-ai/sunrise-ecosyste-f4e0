import { UserInterface } from 'interfaces/user';
import { GetQueryInterface } from 'interfaces';

export interface PlanInterface {
  id?: string;
  wake_up_time: any;
  walking_route: string;
  meal_plan: string;
  user_id?: string;
  created_at?: any;
  updated_at?: any;

  user?: UserInterface;
  _count?: {};
}

export interface PlanGetQueryInterface extends GetQueryInterface {
  id?: string;
  walking_route?: string;
  meal_plan?: string;
  user_id?: string;
}
