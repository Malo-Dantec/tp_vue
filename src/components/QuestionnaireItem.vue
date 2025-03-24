<template>
    <li>
        <div>
        <!-- Modification du titre -->
        <input type="text" v-model="questionnaire.title" @blur="update" />
        <button @click="remove">Supprimer</button>
        </div>

        <h3>Questions</h3>
        <!-- Affichage des questions -->
        <ul>
        <QuestionItem
            v-for="question in questionnaire.questions"
            :key="question.id"
            :question="question"
            @update-question="updateQuestion"
            @remove-question="removeQuestion"
        />
        </ul>
        <!-- Formulaire pour ajouter une nouvelle question -->
        <form @submit.prevent="addQuestion">
        <input v-model="newQuestionText" placeholder="Ajouter une question" required />
        <button type="submit">Ajouter</button>
        </form>
    </li>
</template>

<script>
import QuestionItem from "./QuestionItem.vue";

export default {
    name: "QuestionnaireItem",
    props: {
        questionnaire: Object,
    },
    components: {
        QuestionItem,
    },
    data() {
        return {
        newQuestionText: "",
        };
    },
    methods: {
        // Émet l'événement de suppression vers le parent
        remove() {
        this.$emit("remove", this.questionnaire.id);
        },
        // Émet l'événement de mise à jour vers le parent
        update() {
        this.$emit("update", this.questionnaire);
        },
        // Ajoute une nouvelle question
        addQuestion() {
        if (!this.newQuestionText.trim()) return;
        const newQuestion = {
            id: Date.now(), // Identifiant généré temporairement
            text: this.newQuestionText,
        };
        this.questionnaire.questions.push(newQuestion);
        this.newQuestionText = "";
        this.update();
        },
        // Supprime une question
        removeQuestion(questionId) {
        this.questionnaire.questions = this.questionnaire.questions.filter(
            (q) => q.id !== questionId
        );
        this.update();
        },
        // Met à jour une question existante
        updateQuestion(updatedQuestion) {
        const index = this.questionnaire.questions.findIndex(
            (q) => q.id === updatedQuestion.id
        );
        if (index !== -1) {
            this.questionnaire.questions.splice(index, 1, updatedQuestion);
            this.update();
        }
        },
    },
};
</script>

<style scoped>
    li {
    border: 1px solid #ddd;
    margin-bottom: 15px;
    padding: 10px;
    }
    input[type="text"] {
    margin-right: 5px;
    }
</style>
