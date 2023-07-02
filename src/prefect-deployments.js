import promClient from 'prom-client';
import _ from 'lodash';
import fetchApi from './get-request.js';

const deploymentsGauge = new promClient.Gauge({
  name: 'prefect_current_deployments',
  help: 'a prefect deployment which can be scheduled~1 or not scheduled~0',
  labelNames: ['tags', 'name', 'schedule_interval', 'last_updated', 'updated_by'],
});

// eslint-disable-next-line import/prefer-default-export
const fetchDeployments = async (sendRequest) => {
  const deployments = await sendRequest('DEPLOYMENTS_FILTER');
  _.forEach(deployments, (deployment) => {
    deploymentsGauge
      .labels({
        tags: deployment.tags.toString(),
        name: deployment.name,
        schedule_interval: deployment.schedule?.interval || '',
        updated_by: deployment.updated_by?.display_value || '',
        last_updated: deployment.updated,
      })
      .set(deployment.is_schedule_active ? 1 : 0);
  });
};

export default async () => [fetchDeployments(fetchApi)];
