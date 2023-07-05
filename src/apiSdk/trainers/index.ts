import axios from 'axios';
import queryString from 'query-string';
import { TrainerInterface, TrainerGetQueryInterface } from 'interfaces/trainer';
import { GetQueryInterface } from '../../interfaces';

export const getTrainers = async (query?: TrainerGetQueryInterface) => {
  const response = await axios.get(`/api/trainers${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const createTrainer = async (trainer: TrainerInterface) => {
  const response = await axios.post('/api/trainers', trainer);
  return response.data;
};

export const updateTrainerById = async (id: string, trainer: TrainerInterface) => {
  const response = await axios.put(`/api/trainers/${id}`, trainer);
  return response.data;
};

export const getTrainerById = async (id: string, query?: GetQueryInterface) => {
  const response = await axios.get(`/api/trainers/${id}${query ? `?${queryString.stringify(query)}` : ''}`);
  return response.data;
};

export const deleteTrainerById = async (id: string) => {
  const response = await axios.delete(`/api/trainers/${id}`);
  return response.data;
};
