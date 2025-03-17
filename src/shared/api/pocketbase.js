import PocketBase from 'pocketbase'

const pb = new PocketBase("https://sys.fly.dev");

pb.autoCancellation(false);

export {
  pb
}
