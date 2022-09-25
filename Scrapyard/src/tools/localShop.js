const local = (() => {
    let LocalShop = {};

    const checkLogin = () => Date() - Date(LocalShop.loginDate) <= LocalShop.maxAge;

    const load = () => {
        LocalShop = localStorage.getItem('localShop');
    };

    return {load, checkLogin};
})();

export default local;
