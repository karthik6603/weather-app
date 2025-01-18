
var weatherINfoIbj ={};

window.addEventListener('load', ()=>{
    //Logic to read the coordinates
    var apikey = 'BECeKaK6jwCouj7OU8T3lUAgrerGqOh0';
    var lat, long;
    var country, locationKey, timeZone, locationName;
    navigator.geolocation.getCurrentPosition((position)=>{
        // console.log(position)
        lat = position['coords']['latitude']
        long = position['coords']['longitude']
        console.log(lat+" "+long)
        var geopositionurl = `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${apikey}&q=${lat},${long}`;
        axios.get(geopositionurl).then((response)=>{
            weatherINfoIbj['country'] = response.data.Country.EnglishName;
            weatherINfoIbj['locationKey'] = response.data.Key;
            weatherINfoIbj['timeZone'] = response.data.TimeZone;
            weatherINfoIbj['currentLocation'] = response.data.LocalizedName;
            getWeatherData(apikey, weatherINfoIbj.locationKey)
        })
    })
})

function getWeatherData(apikey, locationKey){
    var weatherUrl =`http://dataservice.accuweather.com/forecasts/v1/daily/1day/${locationKey}?apikey=${apikey}`;
    axios.get(weatherUrl).then((response)=>{
        console.log("Weather response",response)
        weatherINfoIbj['today'] = response.data.DailyForecasts[0].Date;
        weatherINfoIbj['day'] = response.data.DailyForecasts[0].Day
        weatherINfoIbj['night'] = response.data.DailyForecasts[0].Night
        weatherINfoIbj['temperature'] = response.data.DailyForecasts[0].Temperature

        var today = new Date(weatherINfoIbj['today'])
        // var IconUrl = `https://developer.accuweather.com/sites/default/files/${}-s.png`;
        // var nightIconurl = "";
        console.log(weatherINfoIbj)

        returnId('country').textContent = weatherINfoIbj['country']
        returnId('currentLocation').textContent = weatherINfoIbj['currentLocation']
        returnId('date').textContent = today.getDate()+'-'+(today.getMonth() +1)+'-'+today.getFullYear()+' '+weatherINfoIbj.timeZone.Code;
        returnId('temperature').textContent = weatherINfoIbj.temperature.Maximum.Value+'0 F - '+weatherINfoIbj.temperature.Minimum.Value+'0 F'
        console.log(weatherINfoIbj['today'])

        if(weatherINfoIbj.day.Icon<10){
            returnId('morning').setAttribute('src', `https://developer.accuweather.com/sites/default/files/0${weatherINfoIbj.day.Icon}-s.png`)
        }else{
            returnId('morning').setAttribute('src', `https://developer.accuweather.com/sites/default/files/${weatherINfoIbj.day.Icon}-s.png`)
        }
        if(weatherINfoIbj.night.Icon<10){
            returnId('night').setAttribute('src', `https://developer.accuweather.com/sites/default/files/0${weatherINfoIbj.night.Icon}-s.png`)
        }else{
            returnId('night').setAttribute('src', `https://developer.accuweather.com/sites/default/files/${weatherINfoIbj.night.Icon}-s.png`)
        }

        returnId('morning-desc').textContent = weatherINfoIbj.day.IconPhrase
        returnId('night-desc').textContent = weatherINfoIbj.night.IconPhrase

    })   
}

function returnId(id){
    return document.getElementById(id);
}
