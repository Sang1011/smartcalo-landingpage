export const EXERCISE_URLS = {
  GET_EXERCISES: "/exercises",
  CREATE_EXERCISE: "/exercises",
  UPDATE_EXERCISE: (id: string) => `/exercises/${id}`,
  DELETE_EXERCISE: (id: string) => `/exercises/${id}`,
};
