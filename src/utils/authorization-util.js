/**
 * 授权检查工具
 */

import { isValidVariable } from './basic-verify';

const AuthorizationUtil = {
    /**
     * 判断用户是否拥有权限
     *
     * @param authority 权限集合
     * @param code 权限码
     * @returns {Boolean}
     */
    hasAuthorized : (authority, code) => {
        //校验数据有效性
        if (!authority || !isValidVariable(code)) {
            return false;
        }

        for ( var i in authority) {
            var auth = authority[i];
            if (auth.code == code) {
                return true;
            }
        }
        return false;
    },
};


export { AuthorizationUtil, };
