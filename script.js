let backgroundPhotoData = {}
const backgroundSource = document.querySelector('.background-source')

const getBackgroundPhoto = async () => {
    const res = await fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature")
    const data = await res.json()
    console.log(data)
    Object.assign(backgroundPhotoData, data)
}

const renderBackground = () => {
    document.body.style.backgroundImage = `url(${backgroundPhotoData.urls.full})`
    const username = backgroundPhotoData.user.instagram_username
    let sourceLink = document.createElement('a')
    sourceLink.href = `https://www.instagram.com/${username}`
    sourceLink.target = '_blank'
    sourceLink.innerHTML = ` @${username}`
    if (!username) {
        sourceLink.href = '#'
        sourceLink.target = ''
        sourceLink.innerHTML = ` ${backgroundPhotoData.user.first_name} ${backgroundPhotoData.user.last_name}`
    }
    backgroundSource.append(sourceLink)
}

getBackgroundPhoto().then(renderBackground)