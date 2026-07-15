import { ChuckNorrisResponse } from '../types/Task';

export async function getChuckNorrisJoke(): Promise<ChuckNorrisResponse> {
  const response = await fetch(
    'https://api.chucknorris.io/jokes/random'
  );

  if (!response.ok) {
    throw new Error('Error loading Chuck Norris phrase.');
  }

  const data = await response.json();

  return data;
}