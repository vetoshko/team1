import React from 'react';

export default class NewPhotoBlock extends React.Component {
    constructor(params) {
        super(params);
        this.state = {
            id: params.id,
            link: params.photoData.url,
            description: '',
            lat: params.photoData.geo.lat,
            lon: params.photoData.geo.lon,
            hint: ''
        };
        this.params = params;
        this.handleChange = this.handleChange.bind(this);
        this.updateState = this.updateState.bind(this);
        this.setGeoToNodes = this.setGeoToNodes.bind(this);
    }

    setGeoToNodes(lat, lon) {
        var updateState = this.updateState;

        var latNode = document.getElementsByName('lat')[this.state.id];
        var lonNode = document.getElementsByName('lon')[this.state.id];
        latNode.value = lat;
        lonNode.value = lon;
        updateState(latNode);
        updateState(lonNode);
    }

    yMap() {
        ymaps.ready(init);

        var mapId = this.state.id;
        var onChange = this.handleChange;
        var updateState = this.updateState;
        var setGeoToNodes = this.setGeoToNodes;

        var photoLat = this.state.lat;
        var photoLon = this.state.lon;

        function init() {
            var myMap;
            var myPlacemark;

            // Если в картинке были координаты - создаем карту
            // с меткой по этим координатам
            if (photoLat && photoLon) {
                createMap({
                    center: [photoLat, photoLon],
                    zoom: 13
                });

                myPlacemark = createPlacemark([photoLat, photoLon]);
                myMap.geoObjects.add(myPlacemark);
                // Слушаем событие окончания перетаскивания на метке.
                myPlacemark.events.add('dragend', function () {
                    getAddress(myPlacemark.geometry.getCoordinates());
                });
                getAddress([photoLat, photoLon]);

                setGeoToNodes(photoLat, photoLon);
            } else {
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
            }

            function createMap (state) {
                myMap = new ymaps.Map(`${mapId}`, state, {
                    searchControlProvider: 'yandex#search'
                });
                // Слушаем клик на карте
                myMap.events.add('click', function (e) {
                    var coords = e.get('coords');

                    // Запишем координаты в поля
                    setGeoToNodes(coords[0], coords[1]);

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

    componentWillMount() {
        // Запускаем инициализацию карты
        this.yMap.bind(this)();
    }

    handleChange(e) {
        this.updateState(e.target);
    }

    updateState(fromNode) {
        var elemName = fromNode.name;
        var newState = {}; // Почему-то динамический ключ не сработал
                           // Пришлось по старинке
        newState[elemName] = fromNode.value;
        this.setState(newState, () => {
            this.params.stateChangedCallback(this.state);
        });
    }

    render() {
        return (
            <div className="stages-list__elem">
                <p className="stage__error"></p>
                <img className="stage__photo" src={this.state.link}/>
                <textarea rows="3" name="description" className="stage__description"
                          placeholder="Описание" onChange={this.handleChange} required></textarea>
                <input type="text" name="lat" className="stage__lat" placeholder="Широта" onChange={this.handleChange} required/>
                <input type="text" name="lon" className="stage__lon" placeholder="Долгота" onChange={this.handleChange} required/>
                <textarea rows="3" name="hint" className="stage__hint"
                          placeholder="Подсказка" onChange={this.handleChange} required></textarea>
                <div className="stage__map" id={this.state.id}></div>
            </div>
        );

    }
}
