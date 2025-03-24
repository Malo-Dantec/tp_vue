<template>
  <div class="container">
    <h1>Liste des questionnaires</h1>
    <!-- Formulaire pour ajouter un questionnaire -->
    <form @submit.prevent="addQuestionnaire" class="mb-4">
      <input v-model="newQuestionnaireTitle" placeholder="Titre du questionnaire" required />
      <button type="submit">Ajouter un questionnaire</button>
    </form>

    <!-- Affichage de la liste des questionnaires -->
    <ul>
      <QuestionnaireItem
        v-for="questionnaire in questionnaires"
        :key="questionnaire.id"
        :questionnaire="questionnaire"
        @remove="removeQuestionnaire"
        @update="updateQuestionnaire"
      />
    </ul>
  </div>
</template>

<script>
import QuestionnaireItem from './components/QuestionnaireItem.vue';
import axios from 'axios';

export default {
  name: "App",
  components: {
    QuestionnaireItem,
  },
  data() {
    return {
      questionnaires: [],
      newQuestionnaireTitle: "",
    };
  },
  methods: {
    // Récupère les questionnaires depuis le backend
    async fetchQuestionnaires() {
      try {
        const response = await axios.get('http://localhost:3000/questionnaires');
        this.questionnaires = response.data;
      } catch (error) {
        console.error("Erreur lors du chargement des questionnaires :", error);
      }
    },
    // Ajoute un nouveau questionnaire
    async addQuestionnaire() {
      if (!this.newQuestionnaireTitle.trim()) return;
      const newQuestionnaire = {
        title: this.newQuestionnaireTitle,
        questions: [],
      };
      try {
        const response = await axios.post('http://localhost:3000/questionnaires', newQuestionnaire);
        this.questionnaires.push(response.data);
        this.newQuestionnaireTitle = "";
      } catch (error) {
        console.error("Erreur lors de l'ajout du questionnaire :", error);
      }
    },
    // Supprime un questionnaire
    async removeQuestionnaire(id) {
      try {
        await axios.delete(`http://localhost:3000/questionnaires/${id}`);
        this.questionnaires = this.questionnaires.filter(q => q.id !== id);
      } catch (error) {
        console.error("Erreur lors de la suppression du questionnaire :", error);
      }
    },
    // Met à jour un questionnaire
    async updateQuestionnaire(updatedQuestionnaire) {
      try {
        await axios.put(`http://localhost:3000/questionnaires/${updatedQuestionnaire.id}`, updatedQuestionnaire);
        const index = this.questionnaires.findIndex(q => q.id === updatedQuestionnaire.id);
        if (index !== -1) {
          this.questionnaires.splice(index, 1, updatedQuestionnaire);
        }
      } catch (error) {
        console.error("Erreur lors de la mise à jour du questionnaire :", error);
      }
    },
  },
  mounted() {
    this.fetchQuestionnaires();
  },
};
</script>

<style>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}
.mb-4 {
  margin-bottom: 1.5rem;
}
</style>
