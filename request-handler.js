import axios from 'axios'
import merge from 'deepmerge'

const BASE_URL = 'https://jsonplaceholder.typicode.com'

function start(iterator) {
  const processing = iterator.next().value
  return processing instanceof Array ?
    axios.all(processing)
      .then(response => iterator.next(response).value)
    : processing
      .then(response => iterator.next(response).value)
      .catch(error => console.log(error))
}

function* requestHandler(request) {
  const response = yield (request instanceof Array) ? request.map(r => axios(r)): axios(request)
  let data
  if(response instanceof Array){
    data = response.map(r => r.data)
  } else {
    data = response.data
  }
  return data
}

function createRequestConfig(method = 'get', path = '', ...additionalConfigs) {
  const baseConfig = {
    method,
    url: `${BASE_URL}${path}`,
    headers: {
      Accept: 'application/json',
      'content-type': 'application/json'
    },
    withCredentials: false
  }
  return merge(baseConfig, ...additionalConfigs)
}

function get(route, config = {}) {
  const routes = route instanceof Array && route.map(r => createRequestConfig('get', r, config))
  console.log(routes)
  const requestConfig = routes ? routes : createRequestConfig('get', route, config)
  const iterator = requestHandler(requestConfig)
  return start(iterator)
}

export { get }
