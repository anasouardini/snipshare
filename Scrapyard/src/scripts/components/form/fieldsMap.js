import Coworkers from './fields/coworkers';
import IsPrivate from './fields/isPrivate';
import Snippet from './fields/snippet';

const fieldsMap = {
    Coworkers,
    IsPrivate,
    Snippet,
};

export default (type) => fieldsMap[type] ?? type;
