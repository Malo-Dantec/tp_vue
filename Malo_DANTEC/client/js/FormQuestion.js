class FormQuestion extends HTMLLIElement {
    constructor(formQuestionnaire){
        super();
        this.style.margin = "1em";
        this.style.border = '0.1em solid black';
        this.style.width = "fit-content";
        this.style.listStyle = "none";
        this.style.borderRadius = "15px";
        formQuestionnaire.querySelector('#listeQuestions').append(this);
        this.formQuestionnaire = formQuestionnaire;
        let titre = document.createElement('div');
        this.append(titre);
        titre.style.display = "flex";
        titre.style.alignItems = "center"
        titre.style.justifyContent = "space-between"
        titre.style.padding = "0.3em";
        titre.style.gap = "0.5em";
        let titreQuestion = document.createElement('label');
        titreQuestion.setAttribute('for', 'titreQuestion');
        titreQuestion.setAttribute('id', 'titreQuestionLabel');
        titreQuestion.textContent = 'Titre';
        titre.append(titreQuestion);
        let titreQuestionInput = document.createElement('input');
        titreQuestionInput.id = 'titreQuestion';
        titre.append(titreQuestionInput);
        titreQuestionInput.style.padding = "0.5em";
        titreQuestionInput.style.borderRadius = "15px";
        titreQuestionInput.style.border = "none";
        let type = document.createElement('div');
        this.append(type);
        type.style.display = "flex";
        type.style.alignItems = "center";
        type.style.justifyContent = "space-between";
        type.style.padding = "0.3em";
        type.style.gap = "0.5em";
        let typeQuestion = document.createElement('label');
        typeQuestion.setAttribute('for', 'typeQuestion');
        typeQuestion.setAttribute('id', 'typeQuestionLabel');
        typeQuestion.textContent = 'Type';
        type.append(typeQuestion);
        let typeQuestionInput = document.createElement('input');
        typeQuestionInput.id = 'typeQuestion';
        type.append(typeQuestionInput);
        typeQuestionInput.style.padding = "0.5em";
        typeQuestionInput.style.borderRadius = "15px";
        typeQuestionInput.style.border = "none";
        let boutons = document.createElement('div');
        boutons.id = 'boutonsQuestion';
        this.append(boutons);
        let saveQuestion = document.createElement('img');
        saveQuestion.src = 'img/save.png';
        saveQuestion.onclick = () => this.saveNewQuestion();
        boutons.append(saveQuestion);
    }

    fillFormQuestion(question){
        this.question = question;
        let titreQuestionInput = this.querySelector('#titreQuestion');
        titreQuestionInput.value = question.title;
        let typeQuestionInput = this.querySelector('#typeQuestion');
        typeQuestionInput.value = question.type;
        let boutons = this.querySelector('#boutonsQuestion');
        Utilitaire.clearContent(boutons);
        let deleteQuestionButton = document.createElement('img');
        deleteQuestionButton.src = 'img/delete.png';
        deleteQuestionButton.onclick = () => this.deleteQuestion();
        boutons.append(deleteQuestionButton);
        let saveQuestion = document.createElement('img');
        saveQuestion.src = 'img/save.png';
        saveQuestion.onclick = () => this.saveModifiedQuestion();
        boutons.append(saveQuestion);
    }
    saveNewQuestion(){
        let title = this.querySelector('#titreQuestion').value;
        let type = this.querySelector('#typeQuestion').value;
        const errors = [];
        if (!title) errors.push("Il est impossible de créer une question avec un title vide");
        if (!type) errors.push("Il est impossible de créer une question avec un type vide");
        if (errors.length){
            errors.forEach(error => Utilitaire.errorClient(error));
        }
        else {
            fetch('http://localhost:5000/api/questions',{
            headers: {'Content-Type': 'application/json'},
            method: 'POST',
            body: JSON.stringify({"title":title, "type":type, "questionnaire_id":this.formQuestionnaire.questionnaire.id})
            })
            .then(response => {
                if (response.ok){
                    Utilitaire.successMessage('Insert Success');
                    return response.json();
                }
                else throw new Error('Problème ajax: ' + response.status);
            })
            .then(async dataQuestion => {
                await this.formQuestionnaire.questionnaire.getQuestions();
                this.fillFormQuestion(this.formQuestionnaire.questionnaire.getQuestion(dataQuestion.id));
            })
            .catch(Utilitaire.errorServeur);
        }
    }
    saveModifiedQuestion(){
        let title = this.querySelector('#titreQuestion').value;
        let type = this.querySelector('#typeQuestion').value;
        let bodyRequest = {'question_id':this.question.id};
        if (this.question.title != title){
            if (title != ''){
                bodyRequest.title = title;
            }
            else{
                Utilitaire.errorClient("Il n'est pas possible d'avoir un titre vide");
            }
        }
        if (this.question.type != type){
            if (type != ''){
                bodyRequest.type = type;
            }
            else{
                Utilitaire.errorClient("Il n'est pas possible d'avoir un type vide")
            }
        }
        if (Object.keys(bodyRequest).length > 1){
            fetch('http://localhost:5000/api/questions',{
                headers: {'Content-Type': 'application/json'},
                method: 'PUT',
                body: JSON.stringify(bodyRequest)
            })
            .then(response => {
                if (response.ok){
                    Utilitaire.successMessage('Update Success');
                    return response.json();
                }
                else throw new Error('Problème ajax: ' + response.status);
            })
            .then(async dataQuestion => {
                await this.formQuestionnaire.questionnaire.getQuestions();
                this.fillFormQuestion(this.formQuestionnaire.questionnaire.getQuestion(dataQuestion.id));
            })
            .catch(Utilitaire.errorServeur);
        }
        else{
            Utilitaire.errorClient("Aucun changement de fait");
        }
    }
    
    deleteQuestion(){
        fetch('http://localhost:5000/api/questions',{
            headers: {'Content-Type': 'application/json'},
            method: 'DELETE',
            body: JSON.stringify({"question_id":this.question.id})
        })
        .then(async response => {
            if (response.ok){
                Utilitaire.successMessage('Delete Success');
                await this.formQuestionnaire.questionnaire.getQuestions();
                return response.json();
            }
            else throw new Error('Problème ajax: ' + response.status);
        })
        .then(dataQuestion => {
            Utilitaire.successMessage(`Supression de la question ${dataQuestion.title}`);
            this.remove();
        })
        .catch(Utilitaire.errorServeur);
    }
}
customElements.define("form-question", FormQuestion, { extends: "li" });
