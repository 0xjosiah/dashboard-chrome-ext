let backgroundPhotoData = {}
const backgroundSource = document.querySelector('.background-source')
const cryptoName = document.querySelector('#crypto-name')
const ticker = document.querySelector('#ticker')
const currentPrice = document.querySelector('#current-price')
const lowPrice = document.querySelector('#low-price')
const highPrice = document.querySelector('#high-price')
const cryptoDiv = document.querySelector('#crypto')
const cryptoImg = document.querySelector('#crypto-img')
const time = document.querySelector('#time')
const weather = document.querySelector('#weather')
const temp = document.querySelector('#temp')
const weatherIcon = document.querySelector('#weather-icon')
const weatherLocation = document.querySelector('#location')
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
    renderCryptoPrices(data)
}

const renderCryptoPrices = data => {
    ticker.innerHTML = data.tickers[0].base
    cryptoImg.src = data.image.small
    currentPrice.innerHTML = `${data.market_data.current_price.usd} USD`
    highPrice.innerHTML = `${data.market_data.high_24h.usd} USD`
    lowPrice.innerHTML = `${data.market_data.low_24h.usd} USD`
}

const getTime = () => {
    let currentTime = new Date()
    time.innerHTML = currentTime.toLocaleTimeString("en-us", {timeStyle: "short"})
}

navigator.geolocation.getCurrentPosition(position => {
    let lon = position.coords.longitude
    let lat = position.coords.latitude
    getWeather(lon, lat)
})

const getWeather = async (lon, lat) => {
    try {
        const res = await fetch(`https://apis.scrimba.com/openweathermap/data/2.5/weather?lat=${lat}&lon=${lon}&units=imperial`)
        const data = await res.json()
        renderWeather(data)
    } catch(err) {
        console.error(err)
        weatherFallback()
    }
}

const renderWeather = async data => {
    weatherIcon.src = `http://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
    temp.innerHTML = `${data.main.temp.toFixed(0)}º`
    weatherLocation.innerHTML = `${data.name}`
}

const weatherFallback = () => {
    weatherIcon.src = 'http://openweathermap.org/img/wn/01n@2x.png'
    temp.innerHTML = '--º'
    weatherLocation.innerHTML = 'unknown'

}

cryptoName.addEventListener('input', () => getCryptoPrices(cryptoName.value))

getBackgroundPhoto().then(renderBackground).catch(renderDefault)
getCryptoPrices(cryptoName.value).catch(err => console.error(err))
setInterval(getTime, 1000)