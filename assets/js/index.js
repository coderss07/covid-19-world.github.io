var countryElement = {};

function updateMap() {
    fetch("https://disease.sh/v3/covid-19/countries?strict=true").then(res => res.json()).then((resp) => {
        var tot_cases = 0;
        var tot_active = 0;
        var tot_deaths = 0;
        var tot_recovers = 0;
        resp.forEach(data => {
            tot_cases += data.cases;
            tot_active += data.active;
            tot_deaths += data.deaths;
            tot_recovers += data.recovered;
            
            var cdt = new Date();
            var offset = parseInt((cdt.getTime() - data.updated) / (60000));
            // var dt = new Date(data.updated);
            // console.log(cdt.getMinutes())
            var ele = `<div class="location">
            <div class="flag"><img src="${data.countryInfo.flag}"></div>
                            <h2>${data.country}</h2>
                            <hr class="underline">
                            <div class="content"><h4>Confirmed: </h4> <div class="counts">${data.cases.toLocaleString('en-US')} </div> </div>`
            if(data.todayCases > 0) {
                ele += `<div class="sub-cases"><strong class="new-cases"> +${data.todayCases.toLocaleString('en-US')} </strong><span class="time">(updated ${offset} min ago)</span></div>`;
            }
                            
            ele += `<div class="content"><h4>Active:</h4> <div class="counts">${data.active.toLocaleString('en-US')}</div> </div>
                    <div class="content"><h4>Deaths:</h4> <div class="counts">${data.deaths.toLocaleString('en-US')}</div> </div>`;
            if(data.todayDeaths > 0) {
                ele += `<div class="sub-cases"><strong class="new-cases"> +${data.todayDeaths.toLocaleString('en-US')} </strong><span class="time">(updated ${offset} min ago)</span></div>`;
            }                       
            ele += `<div class="content"><h4>Recovered:</h4> <div class="counts">${data.recovered.toLocaleString('en-US')}</div> </div>`;       
            if(data.todayRecovered > 0) {
                ele += `<div class="sub-cases"><strong class="new-cases"> +${data.todayRecovered.toLocaleString('en-US')} </strong><span class="time">(updated ${offset} min ago)</span></div>`;
            }         
            ele += `</div>`;

            countryElement[data.countryInfo.iso2] = ele;
        });
        
        document.querySelector('#tot-data').innerHTML = `
            <li><div class="type">CASES: </div><div class="val">${tot_cases.toLocaleString('en-US')}</div></li>
            <li><div class="type">ACTIVE: </div><div class="val">${tot_active.toLocaleString('en-US')}</div></li>
            <li><div class="type">DEATHS: </div><div class="val">${tot_deaths.toLocaleString('en-US')}</div></li>
            <li><div class="type">RECOVERIES: </div><div class="val">${tot_recovers.toLocaleString('en-US')}</div></li>`;
    })

}

updateMap()

map.on('load', () => {
    map.setFog({
        'horizon-blend': 0.03,
        'color': '#dadada',
        'star-intensity': 0.2
    });

    map.addSource('states', {
        'type': 'geojson',
        'data': 'https://d2ad6b4ur7yvpq.cloudfront.net/naturalearth-3.3.0/ne_50m_admin_0_countries.geojson'
    });

    map.addLayer({
        "id": "state-fills",
        "type": "fill",
        "source": "states",
        "layout": {},
        "paint": {
            "fill-color": "rgba(92, 118, 180, 0.1)",
            "fill-opacity": 0.8
        }
    });

    map.addLayer({
        "id": "state-fills-hover",
        "type": "fill",
        "source": "states",
        "layout": {},
        "paint": {
            "fill-color": "rgba(255, 0, 0, 0.3)",
            "fill-opacity": 1
        },
        "filter": ["==", "name", ""]
    });

    map.on("mousemove", function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ["state-fills"] });
        if (features.length) {
            map.getCanvas().style.cursor = 'pointer';
            map.setFilter("state-fills-hover", ["==", "name", features[0].properties.name]);
        } else {
            map.setFilter("state-fills-hover", ["==", "name", ""]);
            map.getCanvas().style.cursor = '';
        }
    });

    map.on("mouseout", function () {
        map.getCanvas().style.cursor = 'auto';
        map.setFilter("state-fills-hover", ["==", "name", ""]);
    });

    map.on('click', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['state-fills'] });
        if (!features.length) {
            return;
        }

        var feature = features[0];

        var ele = countryElement[feature.properties.iso_a2];
        if(ele == null) {
            ele = `<div class="location">
                        <h2>${feature.properties.name}</h2>
                        <hr class="underline">
                        <div class="content"><h4> Sorry, no data present... </h4></div>
                    </div>`;
            
        }

        var popup = new mapboxgl.Popup()
            .setLngLat(map.unproject(e.point))
            .setHTML(ele)
            .addTo(map);

    });

    map.on('mousemove', function (e) {
        var features = map.queryRenderedFeatures(e.point, { layers: ['state-fills'] });
        map.getCanvas().style.cursor = (features.length) ? 'pointer' : '';
    });

});


document.querySelector('.ham').addEventListener("click", () => {
    var obj = document.querySelector('#check');
    if(obj.checked) {
        document.querySelector('.navbar').className = 'navbar';
    } else {
        document.querySelector('.navbar').className = 'navbar navbar-go';
    }
});

window.onclick = (event) => {
    if(document.querySelector('#check').checked == true) {
        var obj1 = document.querySelector('.navbar').querySelectorAll("*");
        var obj2 = document.querySelector('.ham').querySelectorAll("*");
        var f = true;
        obj1.forEach((el) => {
            if(event.target == el) {
                f = false;
            }
        });
        obj2.forEach((el) => {
            if(event.target == el) {
                f = false;
            }
        });
    
        if(event.target != document.querySelector('.ham') && f) {
            document.querySelector('.navbar').className = 'navbar navbar-go';
            document.querySelector('#check').click();
        }
    }

    if(document.querySelector('#check-2').checked == true) {
        var obj1 = document.querySelector('.box').querySelectorAll("*");
        var obj2 = document.querySelector('.icon-box').querySelectorAll("*");
        var f = true;
        obj1.forEach((el) => {
            if(event.target == el) {
                f = false;
            }
        });
        obj2.forEach((el) => {
            if(event.target == el) {
                f = false;
            }
        });
    
        if(event.target != document.querySelector('.icon-box') && f) {
            document.querySelector('.box').className = 'box box-go';
            setTimeout(() => {
                document.querySelector('#icon').className = 'fa-solid fa-circle-arrow-left';
            }, 400);
            document.querySelector('#check-2').click();
        }
    }
}

document.querySelector('.icon-box').onclick = () => {
    var doc = document.querySelector('#check-2');
    doc.click();
    if(doc.checked) {
        document.querySelector('.box').className = 'box';
        setTimeout(() => {
            document.querySelector('#icon').className = 'fa-solid fa-circle-arrow-right';
        }, 400);
        
    } else {
        document.querySelector('.box').className = 'box box-go';
        setTimeout(() => {
            document.querySelector('#icon').className = 'fa-solid fa-circle-arrow-left';
        }, 400);
    }
}
