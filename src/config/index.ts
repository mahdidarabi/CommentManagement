import development from './envs/development';
import production from './envs/production';

// please generate development and production files in envs dir
// with structure of defaultEnvs

const getConfig = () => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return production;
    default:
      return development;
  }
};

export default getConfig;
