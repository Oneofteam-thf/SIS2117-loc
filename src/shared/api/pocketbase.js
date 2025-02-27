import Pocketbase from 'pocketbase'

// const pb = new Pocketbase('http://127.0.0.1:8090')
const pb = new Pocketbase(import.meta.env.VITE_APP_DB_URL);

pb.autoCancellation(false)

export {
  pb
}
