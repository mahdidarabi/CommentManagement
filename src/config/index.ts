import defaultEnvs from './envs/default';
import development from './envs/development';
import production from './envs/production';

// please generate development and production files in envs dir
// with structure of defaultEnvs

const getConfig = () => {
  switch (process.env.NODE_ENV) {
    case 'development':
      return development;
    case 'production':
      return production;
    default:
      return defaultEnvs;
  }
};

export default getConfig;
