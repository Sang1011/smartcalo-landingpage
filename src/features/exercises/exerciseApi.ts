import axiosClient from "../../api/axiosClient";
import { EXERCISE_URLS } from "./exerciseUrls";

interface GetExercisesParams {
  PageIndex?: number;
  PageSize?: number;
  name?: string;
  difficulty?: number;
  isAscending?: boolean;
}

export const exerciseApi = {
  getExercises: (params: GetExercisesParams) =>
    axiosClient.get(EXERCISE_URLS.GET_EXERCISES, { params }),

  deleteExercise: (id: string) =>
    axiosClient.delete(EXERCISE_URLS.DELETE_EXERCISE(id)),
  createExercise: (formData: FormData) =>
    axiosClient.post(EXERCISE_URLS.CREATE_EXERCISE, formData),
  updateExercise: (id: string, formData: FormData) =>
    axiosClient.put(EXERCISE_URLS.UPDATE_EXERCISE(id), formData),
};
