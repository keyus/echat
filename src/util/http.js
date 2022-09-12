import { Toast } from 'antd-mobile';

const blob_file = ['stream', 'excel', 'download', 'blob'];
const baseURL = '/api/';

class HttpService {
    defaultHeader() {
        return new Headers({
            'Content-Type': 'application/json;charset=UTF-8',
            'Token': location.href.replace(/\+/g,'%20').match(/token=([^&]*)/)?
                decodeURIComponent(location.href.replace(/\+/g,'%20').match(/token=([^&]*)/)[1])
                :localStorage.getItem('eeToken'),
        });
    }
    genUrl = (str) => {
        if (typeof str !== 'string') return baseURL;
        if (str.startsWith('/')) str = str.substring(1);
        return `${baseURL}${str}`;
    }
    get(url, body, option = {}) {
        return this.send(url, body, 'get', option);
    }
    post(url, body, option = {}) {
        return this.send(url, body, 'post', option);
    }
    async send(url, body, method, option) {
        let instance = null;
        const headers = this.defaultHeader();
        const isFormdata = body instanceof FormData;
        if (isFormdata) headers.delete('Content-Type');

        return new Promise((resolve, reject) => {
            fetch(
                this.genUrl(url),
                {
                    ...option,
                    method,
                    headers,
                    body: isFormdata ? body : JSON.stringify(body),
                }
            )
                .then(response => {
                    instance = response;
                    //http code 200
                    if (response.ok) {
                        const contentType = response.headers.get('content-type').toLocaleLowerCase();
                        //stream
                        if (blob_file.some(it => contentType.includes(it))) return response.blob();
                        return response.json();
                    }
                    reject(response.statusText);
                    throw new Error(response.statusText);
                })
                .then(response => {
                    if (response instanceof Blob) {
                        return resolve({
                            code: 0,
                            headers: instance.headers,
                            data: response,
                        });
                    }
                    const {
                        code,
                        msg,
                    } = response;
                    if (code === 0 || code === 1666 || code === 1669 || code === 665 || code === 1633) return resolve(response);
                    reject(response);
                })
                .catch(error => {
                    if (error.name && error.name === 'AbortError') {
                        return reject(error);
                    } else {
                        Toast.show({ content: '网络连接失败' });
                        return reject(error);
                    }
                })
        })
    }
}

export default new HttpService();
