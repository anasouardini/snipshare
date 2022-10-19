import IsPrivate from './fields/isPrivate';
import Snippet from './fields/snippet';

const fieldsMap = {
    IsPrivate,
    Snippet,
};

export default (type) => fieldsMap[type] ?? type;
