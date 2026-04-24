import axios from 'axios'

const API = axios.create({ baseURL: 'http://localhost:8000/api' })

export const foodAPI = {
  getAll:  (params = {}) => API.get('/food', { params }),
  add:     (data)        => API.post('/add-food', data),
  accept:  (id, ngo)    => API.patch(`/food/${id}/accept`, { ngo_name: ngo }),
  delete:  (id)          => API.delete(`/food/${id}`),
  stats:   ()            => API.get('/stats'),
  predict: (day)         => API.get(`/predict/${day}`),
}
