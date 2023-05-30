# Manga project

## Front end
```
yarn dev
```

## Back end
```
yarn dev
```

## Deployment
Whenever a pipeline run on github, the project is deployed on ciclic.

## Todo

### Back end
- [x] add new gumgum provider
- [x] add new neko sama provider
- [ ] add new anime sama provider
- [ ] implement file peristence. Manga should persisted as json
- [ ] implement delta producer : produce delta between previous state and new mangas from providers

### Front end
- [ ] rework manga list display to only provider external link
- [ ] add possibility to follow manga, to get noticed when a new episode from manga is published
