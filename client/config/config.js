import developmentConfig from './config.development.json';
import developmentConor from './config.developmentConor.json';
import productionConfig from './config.production.json';
export default ( process.env.NODE_ENV === 'production' ) ? productionConfig : ( process.env.NODE_ENV === 'conor' ? developmentConor : developmentConfig);
