import IsPrivate from './fields/isPrivate';
import CodeSnippet from './fields/snippet';

const fieldsMap = {
    IsPrivate,
    CodeSnippet,
};

export default (type) => fieldsMap[type] ?? type;
