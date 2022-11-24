import IsPrivate from './fields/isPrivate';
import CodeSnippet from './fields/snippet';
import Categories from './fields/categories';
import Language from './fields/language';

const fieldsMap = {
    IsPrivate,
    CodeSnippet,
    Categories,
    Language,
};

export default (type) => fieldsMap[type] ?? type;
