import React from 'react';
import ReactDOM from 'react-dom';
import NewPhotoBlock from './NewPhotoBlock.jsx';

export default class NewQuest extends React.Component {
    constructor(params) {
        super(params);
        this.state = {
            allStagesComponents: [], // Все дочерние компоненты-этапы квеста
            photosData: [] // Все ссылки на загруженные фото и геопозиции
        };
        this.allStagesData = {}; //Данные из заполненных дочерних компонент
                                 // Обновляется при каждом изменении одного из дочерних
                                 // компонентов
    }

    stageDataChangedCallback(newState) {
        // Обновляем данные по фотографии
        this.allStagesData[newState.id] = newState;
    }

    // Загрузка всех фото квеста
    uploadPhotos() {
        let imagesFormData = new FormData(document.forms['photos-upload-form']);
        fetch('/quests/new-quest/photos', {
            method: 'POST',
            body: imagesFormData,
            credentials: 'same-origin'
        }).then(response => {
            return response.json();
        }).then(photosData => {
            this.setState({photosData});

            var allStagesComponents = photosData.map((photoData, index) => <NewPhotoBlock
                photoData={photoData}
                key={index}
                id={index}
                stateChangedCallback={this.stageDataChangedCallback.bind(this)}
            />);
            this.setState({allStagesComponents});
        });
    }

    // Загрузка всего квеста
    uploadQuest() {
        let questFormData = new FormData(document.forms['quest-form']);

        // Добавим информацию по всем стадиям квеста
        questFormData.append("questStages", JSON.stringify(this.allStagesData));

        function checkStatus(response) {
            if (response.status >= 200 && response.status < 300) {
                return response
            } else {
                var error = new Error(response.statusText);
                error.response = response;
                throw error
            }
        }

        fetch('/quests/new-quest', {
            method: 'POST',
            body: questFormData,
            credentials: 'same-origin'
        })
            .then(checkStatus)
            .then(response => {
                return response.json()
            })
            .then(data => {
                location.assign(`/quests/${data.questId}`)
            })
            .catch(error => {
                document.getElementById('new-quest__error').innerHTML = 'Заполните все поля';
                setTimeout(() => {
                    document.getElementById('new-quest__error').innerHTML = '';
                }, 2000);
            });
    }

    handleImageChange(e) {
        e.preventDefault();
    }

    render() {
        return (
            <div className="new-quest">
                <div className="new-quest__info">
                    <p id="new-quest__error" className="new-quest__error"></p>
                    <form name="quest-form" className="new-quest-info__upload" action="/quests/new-quest" method="post" enctype="multipart/form-data">
                        <input type="text" name="name" className="new-quest-info__name" placeholder="Имя квеста" required/>
                        <input type="text" name="city" className="new-quest-info__city" placeholder="Город" required/>
                        <textarea required rows="4" name="description" className="new-quest-info__description"
                                  placeholder="Описание" required></textarea>
                    </form>
                    <form name="photos-upload-form">
                        <input type="file" name="photo" id="photo" onChange={this.handleImageChange.bind(this)} required multiple />
                        <input type="button" onClick={this.uploadPhotos.bind(this)} value="Загрузить" />
                    </form>
                </div>
                <div class="stages-list">
                    {this.state.allStagesComponents}
                </div>
                <input form="quest-form" type="button" onClick={this.uploadQuest.bind(this)} value="Создать квест"/>
            </div>);

    }
}

ReactDOM.render(
    <NewQuest />,
    document.getElementById('photos-list-component')
);
