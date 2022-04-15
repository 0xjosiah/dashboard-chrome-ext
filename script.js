let backgroundPhotoData = {}
const backgroundSource = document.querySelector('.background-source')
const cryptoName = document.querySelector('#crypto-name')
const ticker = document.querySelector('#ticker')
const currentPrice = document.querySelector('#current-price')
const lowPrice = document.querySelector('#low-price')
const highPrice = document.querySelector('#high-price')
const cryptoDiv = document.querySelector('#crypto')
const cryptoImg = document.querySelector('#crypto-img')
const hourSpan = document.querySelector('#hours')
const minSpan = document.querySelector('#minutes')
const defaultBackground = {
    urls: {
        full: '../default_bckgrnd.jpg'
    },
    user: {
        instagram_username: 'clayleconey',
        first_name: 'Clay',
        last_name: 'LeConey'
    }
}

const getBackgroundPhoto = async () => {
    const res = await fetch("https://apis.scrimba.com/unsplash/photos/random?orientation=landscape&query=nature")
    const data = await res.json()
    Object.assign(backgroundPhotoData, data)
}

const createAuthorLink = () => {
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
    return sourceLink
}

const renderBackground = () => {
    document.body.style.backgroundImage = `url(${backgroundPhotoData.urls.full})`
    backgroundSource.append(createAuthorLink())
}

const renderDefault = () => {
    Object.assign(backgroundPhotoData, defaultBackground)
    console.error("unsplash API promise rejected")
    renderBackground()
}

const getCryptoPrices = async crypto => {
    const response = await fetch(`https://api.coingecko.com/api/v3/coins/${crypto}`)
    if(!response.ok) throw Error('something went wrong')
    const data = await response.json()
    // console.log(data)
    renderCryptoPrices(data)
}

const renderCryptoPrices = data => {
    // console.log(data.name)

    // console.log(data.tickers[0].base)
    ticker.innerHTML = data.tickers[0].base

    // console.log(data.image.small)
    cryptoImg.src = data.image.small

    // console.log(data.market_data.current_price.usd)
    currentPrice.innerHTML = `${data.market_data.current_price.usd} USD`
    highPrice.innerHTML = `${data.market_data.high_24h.usd} USD`
    lowPrice.innerHTML = `${data.market_data.low_24h.usd} USD`
}

const getTime = () => {
    let currentTime = new Date()
    // console.log(currentTime)
    let hour = currentTime.getHours()
    // console.log(hour)
    let minutes = currentTime.getMinutes()
    // console.log(minutes)
    renderTime(hour, minutes)
}

const renderTime = (hours, minutes) => {
    let amPm = 'AM'
    if(hours >= 12) amPm = 'PM'
    if(hours == 24) amPm = 'AM'
    if(hours > 12) hours -= 12
    hourSpan.innerHTML = hours
    minSpan.innerHTML = `${minutes} ${amPm}`
}

cryptoName.addEventListener('input', () => getCryptoPrices(cryptoName.value))

getBackgroundPhoto().then(renderBackground).catch(renderDefault)
getCryptoPrices(cryptoName.value).catch(err => console.error(err))
getTime()



