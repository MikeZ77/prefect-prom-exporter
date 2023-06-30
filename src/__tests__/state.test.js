// eslint-disable-next-line import/no-extraneous-dependencies
import { describe, it, jest, beforeEach, expect } from '@jest/globals';
import stateManager from '../state.js';
import mocks from './mock-data.js';
import fetchApi from '../get-request.js';

const { fetchFlowRunsCount, getFlowRunsCount } = stateManager;

describe('fetchFlowRunsCount', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('works', async () => {
    jest.spyOn(fetchApi, 'sendRequest').mockImplementation(mocks.mockFetchApi);
    await fetchFlowRunsCount();
    expect(getFlowRunsCount()).not.toEqual([]);
  });
});
