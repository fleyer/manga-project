function createImageLink(externalLink){
  const defaultImageLink = ""
  const slug = Buffer.from(externalLink || defaultImageLink ).toString('base64url')

  return `/api/images/${slug}`
}

export {
  createImageLink
}