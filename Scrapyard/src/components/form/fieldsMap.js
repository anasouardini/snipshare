import Coworkers from './fields/coworkers';
import IsPrivate from './fields/isPrivate';

const fieldsMap = {
    Coworkers,
    IsPrivate,
};

export default (type) => fieldsMap[type] ?? type;
