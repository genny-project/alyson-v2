import developmentConfig from './config.development.json';
import productionConfig from './config.production.json';
export default ( process.env.NODE_ENV === 'production' ) ? productionConfig : developmentConfig;
