export default {
  proxyVideoRequest: (link) => {
    return `http://localhost:3333/proxy/video?link=${Buffer.from(link,'ascii').toString('base64')}`
  }
}