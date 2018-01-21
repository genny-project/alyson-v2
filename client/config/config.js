import developmentConfig from './config.development.js';
import productionConfig from './config.production.js';
export default ( process.env.NODE_ENV === 'production' ) ? productionConfig :  developmentConfig;
