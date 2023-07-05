import axios from 'axios';
import queryString from 'query-string';
import { PlanInterface, PlanGetQueryInterface } from 'interfaces/plan';
import { GetQueryInterface } from '../../interfaces';

export const getPlans = async (query?: PlanGetQueryInterface) => {
  const response = await axios.get(`/api/plans${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createPlan = async (plan: PlanInterface) => {
  const response = await axios.post('/api/plans', plan);
  return response.data;
};

export const updatePlanById = async (id: string, plan: PlanInterface) => {
  const response = await axios.put(`/api/plans/${id}`, plan);
  return response.data;
};

export const getPlanById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/plans/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deletePlanById = async (id: string) => {
  const response = await axios.delete(`/api/plans/${id}`);
  return response.data;
};
