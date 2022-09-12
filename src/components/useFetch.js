
import { useRequest } from 'ahooks'
import http from '../util/http'


export default (url, data, options = {}) => {
    const fetcher = () => {
        return http.post(url, data);
    }
    // options.cacheKey ??= url;
    return useRequest(fetcher, options)
}