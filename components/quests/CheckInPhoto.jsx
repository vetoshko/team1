import React from 'react';

export default class CheckInPhoto extends React.Component {
    constructor(params) {
        super(params);
        this.state = {
            questId: params.questId,
            photoId: params.photoId,
            photoUploaded: false,
            geoFromPhoto: null, //[lat, lon]
            geoFromMap: null,
            comparisonResult: false
        };
        this.setGeoToState = this.setGeoToState.bind(this);
    }

    setGeoToState(lat, lon) {
        this.setState({geoFromMap: {lat: lat, lon: lon}});
    }

    yMap() {
        ymaps.ready(init);

        var mapId = 'map' + this.state.photoId;
        var setGeoToState = this.setGeoToState;

        function init() {
            var myMap;
            var myPlacemark;

            // Если в картинке были координаты - создаем карту
            // с меткой по этим координатам
            ymaps.geolocation.get().then(function (res) {
                var mapContainer = document.getElementById(mapId);
                var bounds = res.geoObjects.get(0).properties.get('boundedBy');
                // Рассчитываем видимую область для текущей положения пользователя.
                var mapState = ymaps.util.bounds.getCenterAndZoom(
                    bounds,
                    [mapContainer.offsetWidth, mapContainer.offsetHeight]
                );
                createMap(mapState);
            }, function (e) {
                console.log('Cant get user location');
                // Если место положение невозможно получить, то просто создаем карту.
                createMap({
                    center: [55.751574, 37.573856],
                    zoom: 2
                });
            });

            function createMap (state) {
                myMap = new ymaps.Map(`${mapId}`, state, {
                    searchControlProvider: 'yandex#search'
                });
                // Слушаем клик на карте
                myMap.events.add('click', function (e) {
                    var coords = e.get('coords');

                    // Запишем координаты в поля
                    setGeoToState(coords[0], coords[1]);

                    // Если метка уже создана – просто передвигаем ее
                    if (myPlacemark) {
                        myPlacemark.geometry.setCoordinates(coords);
                    }
                    // Если нет – создаем.
                    else {
                        myPlacemark = createPlacemark(coords);
                        myMap.geoObjects.add(myPlacemark);
                        // Слушаем событие окончания перетаскивания на метке.
                        myPlacemark.events.add('dragend', function () {
                            getAddress(myPlacemark.geometry.getCoordinates());
                        });
                    }
                    getAddress(coords);
                });
            }

            // Создание метки
            function createPlacemark(coords) {
                return new ymaps.Placemark(coords, {
                    iconContent: 'поиск...'
                }, {
                    preset: 'islands#violetStretchyIcon',
                    draggable: true
                });
            }

            // Определяем адрес по координатам (обратное геокодирование)
            function getAddress(coords) {
                myPlacemark.properties.set('iconContent', 'поиск...');
                ymaps.geocode(coords).then(function (res) {
                    var firstGeoObject = res.geoObjects.get(0);

                    myPlacemark.properties
                        .set({
                            iconContent: firstGeoObject.properties.get('name'),
                            balloonContent: firstGeoObject.properties.get('text')
                        });
                });
            }
        }
    }

    checkInPhoto() {
        fetch('/users/checkin', {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify({
                geo: this.state.geoFromMap,
                authorPhotoId: this.state.photoId,
                questId: this.state.questId
            }),
            credentials: 'same-origin'
        }).then(response => {
            return response.json();
        }).then(compResult => {
            console.log(compResult);
            this.setState({comparisonResult: compResult.comparisonResult});
        })
    }

    uploadPhoto() {
        let imagesFormData = new FormData(document.forms['check-in-form']);
        // Добавим информацию с оригинальной фографией
        // imagesFormData.append("photoId", this.state.photoId);

        // Используем уже написанный контроллер
        fetch('/quests/new-quest/photos', {
            method: 'POST',
            body: imagesFormData,
            credentials: 'same-origin'
        }).then(response => {
            return response.json();
        }).then(photosData => {
            console.log(photosData);
            this.setState({
                geoFromPhoto: photosData[0].geo,
                photoUploaded: true
            });
            if (!photosData[0].geo.lat) {
                // В фотке нет координат - Запускаем инициализацию карты
                this.render();
                this.yMap.bind(this)();
            } else { // Есть местоположение в фотке - пробуем ее зачекинить
                fetch('/users/checkin', {
                    headers: {
                        'Accept': 'application/json',
                        'Content-Type': 'application/json'
                    },
                    method: 'POST',
                    body: JSON.stringify({
                        geo: photosData[0].geo,
                        authorPhotoId: this.state.photoId,
                        questId: this.state.questId
                    }),
                    credentials: 'same-origin'
                }).then(response => {
                    return response.json();
                }).then(compResult => {
                    console.log(compResult);
                    this.setState({comparisonResult: compResult.comparisonResult});
                })
            }
        });
    }

    render() {
        console.log(this.state);
        if (!this.state.comparisonResult && this.state.photoUploaded){
            return (
                <div className="check-in">
                    <p id="check-in__info" className="check-in__info">Ты сфоткал не то</p>
                </div>
            )
        } else 
        if (this.state.comparisonResult) {
            return (
                <div className="check-in">
                    <p id="check-in__info" className="check-in__info">Все хорошо</p>
                </div>
            )
        } else
        if (this.state.photoUploaded && !this.state.geoFromPhoto.lat) {
            return (
                <div className="check-in">
                    <p id="check-in__info" className="check-in__info">Не удалось получить координаты по фото, используйте карту</p>
                    <div className="check-in__map" id={'map' + this.state.photoId}></div>
                    <input type="button" className="check-in-form__button" onClick={this.checkInPhoto.bind(this)} value="Зачекиниться"/>
                </div>
            );
        } else if (!this.state.photoUploaded) {
            return (
                <div className="check-in">
                    <p id="check-in__info" className="check-in__info"></p>
                    <form name="check-in-form" className="check-in-form__upload" action="/users/checkin" method="post"
                          enctype="multipart/form-data">
                        <input type="file" name="photo" className="check-in-form__photo" id="photo" required/>
                        <input type="button" className="check-in-form__button" onClick={this.uploadPhoto.bind(this)} value="Зачекиниться"/>
                    </form>
                </div>
            );
        } else {
            return (
                <div className="check-in">
                    <p id="check-in__info" className="check-in__info"></p>
                    <form name="check-in-form" className="check-in-form__upload" action="/users/checkin" method="post"
                          enctype="multipart/form-data">
                        <input type="file" name="photo" className="check-in-form__photo" id="photo" required/>
                        <input type="button" className="check-in-form__button" onClick={this.uploadPhoto.bind(this)} value="Зачекиниться"/>
                    </form>
                </div>
            );
        }
    }
}
